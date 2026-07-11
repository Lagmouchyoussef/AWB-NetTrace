import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { TechnicianChecklistService } from '../../../../core/services/technician-checklist.service';
import { TechnicianInterventionService } from '../../../../core/services/technician-intervention.service';
import { TechnicianNoteService } from '../../../../core/services/technician-note.service';
import { Intervention } from '../../../super-admin/pages/interventions/intervention.model';
import { ChecklistItemComponent } from '../../components/checklist-item/checklist-item.component';
import { PhotoCaptureComponent } from '../../components/photo-capture/photo-capture.component';
import { RackReferenceViewComponent } from '../../components/rack-reference-view/rack-reference-view.component';
import { ChecklistItem, RackElevation, TechnicianNote } from '../../technician-execution.model';

const LOCKED_STATUSES = new Set(['COMPLETED', 'CANCELLED']);

// The flagship screen of this role: the header confirms what/where, the checklist and rack
// reference confirm the technician is doing the right thing at the right place, photo capture
// and notes record the evidence, and Complete is the one irreversible action - gated both here
// (button disabled) and server-side (TechnicianExecutionService.complete rejects an incomplete
// checklist regardless of what the UI allowed).
@Component({
  selector: 'app-technician-intervention-detail',
  standalone: true,
  imports: [
    RouterLink,
    TranslatePipe,
    FormsModule,
    DatePipe,
    ChecklistItemComponent,
    RackReferenceViewComponent,
    PhotoCaptureComponent,
  ],
  templateUrl: './intervention-detail.component.html',
  styleUrl: './intervention-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianInterventionDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly interventionService = inject(TechnicianInterventionService);
  private readonly checklistService = inject(TechnicianChecklistService);
  private readonly noteService = inject(TechnicianNoteService);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslateService);

  protected readonly interventionId = Number(this.route.snapshot.paramMap.get('id'));

  protected readonly loading = signal(true);
  protected readonly notFound = signal(false);
  protected readonly intervention = signal<Intervention | null>(null);
  protected readonly checklist = signal<ChecklistItem[]>([]);
  protected readonly rackElevation = signal<RackElevation | null>(null);
  protected readonly rackElevationLoading = signal(true);
  protected readonly notes = signal<TechnicianNote[]>([]);
  protected readonly newNoteBody = signal('');
  protected readonly editingNoteId = signal<number | null>(null);
  protected readonly editingNoteBody = signal('');

  protected readonly starting = signal(false);
  protected readonly completing = signal(false);
  protected readonly justCompleted = signal(false);

  protected readonly locked = computed(() => {
    const current = this.intervention();
    return !current || LOCKED_STATUSES.has(current.status);
  });

  protected readonly checklistInteractive = computed(
    () => this.intervention()?.status === 'IN_PROGRESS',
  );

  protected readonly allChecklistDone = computed(
    () => this.checklist().length > 0 && this.checklist().every((item) => item.completed),
  );

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const intervention = await this.interventionService.getById(this.interventionId);
      this.intervention.set(intervention);
      await Promise.all([this.loadChecklist(), this.loadRackElevation(), this.loadNotes()]);
    } catch {
      this.notFound.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  private async loadChecklist(): Promise<void> {
    this.checklist.set(await this.checklistService.list(this.interventionId));
  }

  private async loadRackElevation(): Promise<void> {
    this.rackElevationLoading.set(true);
    try {
      this.rackElevation.set(await this.interventionService.getRackElevation(this.interventionId));
    } finally {
      this.rackElevationLoading.set(false);
    }
  }

  private async loadNotes(): Promise<void> {
    this.notes.set(await this.noteService.list(this.interventionId));
  }

  protected async onToggleChecklistItem(item: ChecklistItem, completed: boolean): Promise<void> {
    const updated = await this.checklistService.toggle(this.interventionId, item.id, completed);
    this.checklist.set(this.checklist().map((i) => (i.id === updated.id ? updated : i)));
  }

  protected async onStart(): Promise<void> {
    this.starting.set(true);
    try {
      this.intervention.set(await this.interventionService.start(this.interventionId));
    } finally {
      this.starting.set(false);
    }
  }

  protected async onComplete(): Promise<void> {
    const data: ConfirmDialogData = {
      titleKey: 'technician.interventionDetail.completeConfirmTitle',
      messageKey: 'technician.interventionDetail.completeConfirmMessage',
      confirmKey: 'technician.interventionDetail.completeConfirmAction',
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data });
    const confirmed = await new Promise<boolean | string>((resolve) => {
      ref.afterClosed().subscribe((result) => resolve(result ?? false));
    });
    if (!confirmed) {
      return;
    }
    this.completing.set(true);
    try {
      this.intervention.set(await this.interventionService.complete(this.interventionId));
      this.justCompleted.set(true);
    } finally {
      this.completing.set(false);
    }
  }

  protected async onAddNote(): Promise<void> {
    const body = this.newNoteBody().trim();
    if (!body) {
      return;
    }
    const note = await this.noteService.create(this.interventionId, body);
    this.notes.set([note, ...this.notes()]);
    this.newNoteBody.set('');
  }

  protected onStartEditNote(note: TechnicianNote): void {
    this.editingNoteId.set(note.id);
    this.editingNoteBody.set(note.body);
  }

  protected onCancelEditNote(): void {
    this.editingNoteId.set(null);
  }

  protected async onSaveEditNote(note: TechnicianNote): Promise<void> {
    const body = this.editingNoteBody().trim();
    if (!body) {
      return;
    }
    const updated = await this.noteService.update(this.interventionId, note.id, body);
    this.notes.set(this.notes().map((n) => (n.id === updated.id ? updated : n)));
    this.editingNoteId.set(null);
  }

  protected async onDeleteNote(note: TechnicianNote): Promise<void> {
    await this.noteService.delete(this.interventionId, note.id);
    this.notes.set(this.notes().filter((n) => n.id !== note.id));
  }

  protected priorityLabel(priority: string): string {
    return this.translate.instant(`interventions.priority.${priority}`);
  }

  protected statusLabel(status: string): string {
    return this.translate.instant(`interventions.status.${status}`);
  }
}
