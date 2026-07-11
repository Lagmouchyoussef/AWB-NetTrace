import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ChecklistItem } from '../../technician-execution.model';

@Component({
  selector: 'app-checklist-item',
  standalone: true,
  templateUrl: './checklist-item.component.html',
  styleUrl: './checklist-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistItemComponent {
  readonly item = input.required<ChecklistItem>();
  readonly disabled = input<boolean>(false);
  readonly toggled = output<boolean>();

  protected onTap(): void {
    if (this.disabled()) {
      return;
    }
    this.toggled.emit(!this.item().completed);
  }
}
