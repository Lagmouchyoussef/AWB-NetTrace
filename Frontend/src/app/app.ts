import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Dir } from '@angular/cdk/bidi';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Dir],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Injected here (not just in a leaf component) so the language/direction is applied as soon
  // as the app bootstraps, not only once some deeper component happens to need the service.
  protected readonly languageService = inject(LanguageService);
}
