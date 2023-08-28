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
      window.localStorage[ThemeStorageService.storageKey] = theme.name;
    } catch (error) {
      console.error(error);
    }
    this.onThemeUpdate.emit(theme);
  }

  getStoredThemeName(): string | null {
    try {
      return window.localStorage[ThemeStorageService.storageKey] || null;
    } catch {
      return null;
    }
  }

  // TODO: investigate if this is needed in logout
  clearStorage() {
    try {
      window.localStorage.removeItem(ThemeStorageService.storageKey);
    } catch (error) {
      console.error(error);
    }
  }
}
