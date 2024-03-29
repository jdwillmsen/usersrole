import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import firebase from 'firebase/compat/app';
import { ProfileCardComponent } from '../profile-card/profile-card.component';
import { ThemeSelectorComponent } from '../theme-selector/theme-selector.component';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { GithubButtonComponent } from '../github-button/github-button.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLink,
    NgIf,
    ThemeSelectorComponent,
    ProfileCardComponent,
    MatIconModule,
    GithubButtonComponent
  ]
})
export class HeaderComponent {
  @Input() isXSmallScreen = false;
  @Output() toggleSideNav = new EventEmitter<boolean>();
  user: firebase.User | null = null;

  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) {
    this.authService.user$.subscribe({
      next: (user) => (this.user = user),
      error: (error) =>
        this.snackbarService.error(error.error, { variant: 'filled' }, true)
    });
  }

  toggle() {
    this.toggleSideNav.emit();
  }
}
