import { Injectable, computed, effect, signal } from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'awb_theme_preference';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly media = window.matchMedia('(prefers-color-scheme: dark)');
  private readonly systemPrefersDark = signal(this.media.matches);

  readonly preference = signal<ThemePreference>(this.readStoredPreference());

  readonly effectiveTheme = computed<'light' | 'dark'>(() => {
    const preference = this.preference();
    if (preference !== 'system') {
      return preference;
    }
    return this.systemPrefersDark() ? 'dark' : 'light';
  });

  constructor() {
    this.media.addEventListener('change', (event) => this.systemPrefersDark.set(event.matches));

    effect(() => {
      document.documentElement.style.colorScheme = this.effectiveTheme();
    });
  }

  setPreference(preference: ThemePreference): void {
    this.preference.set(preference);
    localStorage.setItem(STORAGE_KEY, preference);
  }

  private readStoredPreference(): ThemePreference {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  }
}
