import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HelloControllerService } from './api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Frontend');
  protected readonly backendMessage = signal('Connexion au backend...');
  protected readonly backendOk = signal(false);

  constructor(private readonly helloService: HelloControllerService) {}

  ngOnInit(): void {
    this.helloService.hello().subscribe({
      next: (res) => {
        this.backendMessage.set(res['message'] ?? '');
        this.backendOk.set(true);
      },
      error: () => {
        this.backendMessage.set('Impossible de joindre le backend (http://localhost:8080). Vérifiez qu\'il est démarré.');
        this.backendOk.set(false);
      }
    });
  }
}
