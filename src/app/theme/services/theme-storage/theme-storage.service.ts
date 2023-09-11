import { EventEmitter, Injectable } from '@angular/core';
import { SiteTheme } from '../../../core/models/site-theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeStorageService {
  static storageKey = 'theme-storage-current-name';
  onThemeUpdate: EventEmitter<SiteTheme> = new EventEmitter<SiteTheme>();

  storeTheme(theme: SiteTheme) {
    try {
      window.localStorage.setItem(ThemeStorageService.storageKey, theme.name);
    } catch (error) {
      console.error(error);
    }
    this.onThemeUpdate.emit(theme);
  }

  getStoredThemeName(): string | null {
    try {
      return window.localStorage.getItem(ThemeStorageService.storageKey);
    } catch {
      return null;
    }
  }

  clearStorage() {
    try {
      window.localStorage.removeItem(ThemeStorageService.storageKey);
    } catch (error) {
      console.error(error);
    }
  }
}
