import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'en' | 'fr' | 'ar' | 'es' | 'zh';

const STORAGE_KEY = 'awb_language';
const SUPPORTED_LANGUAGES: readonly AppLanguage[] = ['en', 'fr', 'ar', 'es', 'zh'];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translateService = inject(TranslateService);

  readonly language = signal<AppLanguage>(this.readStoredLanguage());
  readonly dir = computed<'ltr' | 'rtl'>(() => (this.language() === 'ar' ? 'rtl' : 'ltr'));

  constructor() {
    this.applyLanguage(this.language());
  }

  setLanguage(language: AppLanguage): void {
    this.language.set(language);
    localStorage.setItem(STORAGE_KEY, language);
    this.applyLanguage(language);
  }

  private applyLanguage(language: AppLanguage): void {
    this.translateService.use(language);
    document.documentElement.lang = language;
  }

  private readStoredLanguage(): AppLanguage {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (SUPPORTED_LANGUAGES as string[]).includes(stored ?? '')
      ? (stored as AppLanguage)
      : 'en';
  }
}
