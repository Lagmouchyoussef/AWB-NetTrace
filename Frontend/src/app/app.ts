import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HelloControllerService } from './api';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('Frontend');
  protected readonly backendMessage = signal('Connexion au backend...');
  protected readonly backendOk = signal(false);

  private readonly helloService = inject(HelloControllerService);

  ngOnInit(): void {
    this.helloService.hello().subscribe({
      next: (res) => {
        this.backendMessage.set(res['message'] ?? '');
        this.backendOk.set(true);
      },
      error: () => {
        this.backendMessage.set(
          `Impossible de joindre le backend (${environment.apiBaseUrl}). Vérifiez qu'il est démarré ` +
            `et que le certificat auto-signé a été accepté (ouvrez ${environment.apiBaseUrl}/api/hello ` +
            `dans un onglet et acceptez l'avertissement).`,
        );
        this.backendOk.set(false);
      },
    });
  }
}
