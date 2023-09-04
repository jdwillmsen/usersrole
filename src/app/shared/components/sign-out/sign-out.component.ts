import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { ThemeStorageService } from '../../../theme/services/theme-storage/theme-storage.service';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.scss'],
  standalone: true,
  imports: [MatButtonModule]
})
export class SignOutComponent {
  constructor(
    private authService: AuthService,
    private themeStorageService: ThemeStorageService
  ) {}

  logout() {
    this.authService.authLogout();
    this.themeStorageService.clearStorage();
    removeCustomTheme();
  }
}

function removeCustomTheme() {
  const palettes = ['primary', 'accent', 'warn', 'success', 'error', 'info'];
  const colors: string[] = [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    'A100',
    'A200',
    'A400',
    'A700'
  ];

  for (const palette of palettes) {
    for (const color of colors) {
      document.documentElement.style.removeProperty(`--${palette}-${color}`);
      document.documentElement.style.removeProperty(
        `--${palette}-contrast-${color}`
      );
    }
  }
}
