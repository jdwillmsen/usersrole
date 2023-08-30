import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-sign-out',
    templateUrl: './sign-out.component.html',
    styleUrls: ['./sign-out.component.scss'],
    standalone: true,
    imports: [MatButtonModule]
})
export class SignOutComponent {
  constructor(public authService: AuthService) {}
}
