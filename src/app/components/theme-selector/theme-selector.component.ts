import { Component } from '@angular/core';
import { SiteTheme } from 'src/app/models/site-theme.model';
import { StyleManagerService } from 'src/app/services/style-manager.service';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { User } from 'firebase/auth';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ThemeStorageService } from 'src/app/services/theme-storage.service';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.scss']
})
export class ThemeSelectorComponent {
  currentTheme: SiteTheme | undefined;
  themes: SiteTheme[];
  uid = '';

  constructor(
    private styleManagerService: StyleManagerService,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private snackBarService: SnackbarService,
    private _themeStorageService: ThemeStorageService
  ) {
    this.themes = this.styleManagerService.themes;
    const themeName = _themeStorageService.getStoredThemeName();
    if (themeName) {
      this.selectTheme(themeName);
    }
    this.authService.user$.subscribe({
      next: (user) => {
        this.uid = (user as User).uid;
        this.firestoreService.getUsersDoc(this.uid).then((data) => {
          if (data) {
            this.selectTheme(data['theme']);
          } else {
            this.themes.find((themes) => {
              if (themes.isDefault === true) {
                this.selectTheme(themes.name);
                this.firestoreService.setUsersDoc(this.uid, themes.name);
              }
            });
          }
        });
      },
      error: (error) =>
        this.snackBarService.showSnackbar(error.error, 'Ok', 'error')
    });
    this.styleManagerService.currentThemeName.subscribe((themeName) => {
      if (this.currentTheme?.name !== themeName) {
        this.firestoreService.setUsersDoc(this.uid, themeName);
      }
    });
  }

  selectTheme(themeName: string) {
    const theme = this.themes.find(
      (currentTheme) => currentTheme.name === themeName
    );

    if (!theme) {
      return;
    }

    this.styleManagerService.currentThemeName.next(themeName);
    this.currentTheme = theme;

    if (theme.isDefault) {
      this.styleManagerService.removeStyle('theme');
    } else {
      this.styleManagerService.setStyle('theme', `${theme.name}.css`);
    }

    if (this.currentTheme) {
      this._themeStorageService.storeTheme(this.currentTheme);
    }
  }
}
