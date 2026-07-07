import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../../core/services/auth.service';
import { DcAdminInterventionService } from '../../../../../core/services/dc-admin-intervention.service';
import { Intervention } from '../../../../super-admin/pages/interventions/intervention.model';
import { RejectInterventionDialogComponent } from './reject-intervention-dialog.component';

const PAGE_SIZE = 50;

@Component({
  selector: 'app-dc-admin-approval-queue',
  standalone: true,
  imports: [DatePipe, MatIconModule, MatTooltipModule, TranslatePipe],
  templateUrl: './approval-queue.component.html',
  styleUrl: './approval-queue.component.css',
})
export class DcAdminApprovalQueueComponent implements OnInit {
  private readonly interventionService = inject(DcAdminInterventionService);
  private readonly authService = inject(AuthService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly requests = signal<Intervention[]>([]);
  protected readonly totalCount = signal(0);
  protected readonly loading = signal(false);
  protected readonly pendingActionIds = signal<Set<number>>(new Set());

  protected readonly currentUsername = computed(() => this.authService.username());

  ngOnInit(): void {
    this.load();
  }

  protected isOwnRequest(request: Intervention): boolean {
    return request.requestedByUsername === this.currentUsername();
  }

  protected isActing(request: Intervention): boolean {
    return this.pendingActionIds().has(request.id);
  }

  protected interventionTypeLabel(request: Intervention): string {
    return this.translateService.instant(
      `interventions.interventionType.${request.interventionType}`,
    );
  }

  protected async onApprove(request: Intervention): Promise<void> {
    this.setActing(request.id, true);
    try {
      await this.interventionService.approve(request.id);
      await this.load();
    } catch {
      // Errors here are transient (e.g. someone else just decided it) - a reload surfaces the
      // current true state rather than leaving a stale card with a silently-failed action.
      await this.load();
    } finally {
      this.setActing(request.id, false);
    }
  }

  protected onReject(request: Intervention): void {
    const ref = this.dialog.open(RejectInterventionDialogComponent, {
      width: '480px',
      data: { title: request.title },
    });
    ref.afterClosed().subscribe(async (comment: string | undefined) => {
      if (!comment) {
        return;
      }
      this.setActing(request.id, true);
      try {
        await this.interventionService.reject(request.id, comment);
      } finally {
        this.setActing(request.id, false);
        await this.load();
      }
    });
  }

  private setActing(id: number, acting: boolean): void {
    this.pendingActionIds.update((current) => {
      const next = new Set(current);
      if (acting) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.interventionService.getApprovalQueue({
        page: 0,
        size: PAGE_SIZE,
      });
      this.requests.set(result.content);
      this.totalCount.set(result.totalElements);
    } finally {
      this.loading.set(false);
    }
  }
}
