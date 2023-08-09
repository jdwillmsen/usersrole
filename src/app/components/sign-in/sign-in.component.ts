import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { EMPTY, catchError, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StyleManagerService } from 'src/app/services/style-manager.service';

const googleLogoURL =
  'https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
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
      'logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL)
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
