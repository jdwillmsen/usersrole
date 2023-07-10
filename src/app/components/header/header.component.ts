import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user: any;
  constructor(
    private authService: AuthService,
    private snackBarService: SnackbarService
  ) {
    authService.user$.subscribe({
      next: (user) => (this.user = user),
      error: (error) =>
        this.snackBarService.showSnackbar(error.error, 'Ok', 'error')
    });
  }
}
