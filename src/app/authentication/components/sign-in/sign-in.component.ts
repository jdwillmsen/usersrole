import { Component } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, EMPTY, take } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { StyleManagerService } from 'src/app/core/services/style-manager/style-manager.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { EmailSignInComponent } from '../email-sign-in/email-sign-in.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    EmailSignInComponent,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ]
})
export class SignInComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private snackbarService: SnackbarService,
    private readonly styleManagerService: StyleManagerService
  ) {
    this.matIconRegistry.addSvgIcon(
      'google-logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/google-icon.svg'
      )
    );
    this.styleManagerService.removeStyle('theme');
  }

  login() {
    this.authService
      .googleAuth()
      .pipe(
        take(1),
        catchError((error) => {
          this.snackbarService.error(
            error.message,
            { variant: 'filled' },
            true
          );
          return EMPTY;
        })
      )
      .subscribe((response) => response);
  }
}
