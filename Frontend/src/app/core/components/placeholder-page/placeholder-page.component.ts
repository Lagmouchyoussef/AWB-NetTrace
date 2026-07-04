import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './placeholder-page.component.html',
  styleUrl: './placeholder-page.component.css',
})
export class PlaceholderPageComponent {
  readonly titleKey = input<string>('');
}
