import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { ProfileCardComponent } from '../profile-card/profile-card.component';
import { ThemeSelectorComponent } from '../theme-selector/theme-selector.component';

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
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLink,
    ThemeSelectorComponent,
    ProfileCardComponent,
    MatIconModule,
    GithubButtonComponent
  ]
})
export class HeaderComponent {
  @Input() isXSmallScreen = false;
  @Output() toggleSideNav = new EventEmitter<boolean>();

  private authService = inject(AuthService);
  private snackbarService = inject(SnackbarService);

  user = toSignal(
    this.authService.user$.pipe(
      catchError((error) => {
        this.snackbarService.error(error.error, { variant: 'filled' }, true);
        return EMPTY;
      })
    ),
    { initialValue: null }
  );

  toggle() {
    this.toggleSideNav.emit();
  }
}
