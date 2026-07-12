import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { TechnicianPersonalNoteService } from '../../../../core/services/technician-personal-note.service';
import { PersonalNote } from './personal-note.model';

// Standalone personal notes, independent of any intervention - same add/edit/delete interaction
// pattern as the intervention notes section in intervention-detail.component.ts (signals bound via
// [(ngModel)], direct delete with no confirmation dialog), just with an optional title and no
// intervention scoping. See TechnicianPersonalNoteService/TechnicianPersonalNoteController.
@Component({
  selector: 'app-technician-notes',
  standalone: true,
  imports: [TranslatePipe, FormsModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianNotesComponent implements OnInit {
  private readonly noteService = inject(TechnicianPersonalNoteService);

  protected readonly loading = signal(true);
  protected readonly notes = signal<PersonalNote[]>([]);

  protected readonly newNoteTitle = signal('');
  protected readonly newNoteBody = signal('');
  protected readonly saving = signal(false);

  protected readonly editingNoteId = signal<number | null>(null);
  protected readonly editingNoteTitle = signal('');
  protected readonly editingNoteBody = signal('');

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      this.notes.set(await this.noteService.list());
    } finally {
      this.loading.set(false);
    }
  }

  protected async onAddNote(): Promise<void> {
    const body = this.newNoteBody().trim();
    if (!body) {
      return;
    }
    this.saving.set(true);
    try {
      const title = this.newNoteTitle().trim();
      const note = await this.noteService.create({ title: title || null, body });
      this.notes.set([note, ...this.notes()]);
      this.newNoteTitle.set('');
      this.newNoteBody.set('');
    } finally {
      this.saving.set(false);
    }
  }

  protected onStartEditNote(note: PersonalNote): void {
    this.editingNoteId.set(note.id);
    this.editingNoteTitle.set(note.title ?? '');
    this.editingNoteBody.set(note.body);
  }

  protected onCancelEditNote(): void {
    this.editingNoteId.set(null);
  }

  protected async onSaveEditNote(note: PersonalNote): Promise<void> {
    const body = this.editingNoteBody().trim();
    if (!body) {
      return;
    }
    const title = this.editingNoteTitle().trim();
    const updated = await this.noteService.update(note.id, { title: title || null, body });
    this.notes.set(
      this.notes()
        .map((n) => (n.id === updated.id ? updated : n))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    );
    this.editingNoteId.set(null);
  }

  protected async onDeleteNote(note: PersonalNote): Promise<void> {
    await this.noteService.delete(note.id);
    this.notes.set(this.notes().filter((n) => n.id !== note.id));
  }

  // Deliberately not Angular's DatePipe: the app has no registerLocaleData, so a locale-formatted
  // date (e.g. `| date: 'short'`, used by the intervention-notes screen) would always render in
  // English regardless of the active UI language. A plain numeric format sidesteps that.
  protected formatDate(iso: string): string {
    const date = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
