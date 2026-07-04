import { Component, input } from '@angular/core';
import { AppLanguage } from '../../services/language.service';

@Component({
  selector: 'app-flag-icon',
  standalone: true,
  templateUrl: './flag-icon.component.html',
  styleUrl: './flag-icon.component.css',
})
export class FlagIconComponent {
  readonly language = input.required<AppLanguage>();
}
