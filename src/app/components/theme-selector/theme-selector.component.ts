import { Component } from '@angular/core';
import { SiteTheme } from 'src/app/models/site-theme.model';
import { StyleManagerService } from 'src/app/services/style-manager.service';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { User } from 'firebase/auth';
import { FirestoreService } from 'src/app/services/firestore.service';

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
    private snackBarService: SnackbarService
  ) {
    this.themes = this.styleManagerService.themes;
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
      this.firestoreService.setUsersDoc(this.uid, themeName);
    });
  }

  selectTheme(themeName: string) {
    const theme = this.themes.find((currentTheme) => {
      this.styleManagerService.currentThemeName.next(themeName);
      return currentTheme.name === themeName;
    });

    if (!theme) {
      return;
    }

    this.currentTheme = theme;

    if (theme.isDefault) {
      this.styleManagerService.removeStyle('theme');
    } else {
      this.styleManagerService.setStyle('theme', `${theme.name}.css`);
    }
  }
}
