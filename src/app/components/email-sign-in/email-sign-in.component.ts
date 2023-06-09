import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-email-sign-in',
  templateUrl: './email-sign-in.component.html',
  styleUrls: ['./email-sign-in.component.scss']
})
export class EmailSignInComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  hide = true;

  constructor(private readonly authService: AuthService) {}

  signIn() {
    const { email, password } = this.form.value;
    this.authService.emailAuth(email, password);
  }
}
