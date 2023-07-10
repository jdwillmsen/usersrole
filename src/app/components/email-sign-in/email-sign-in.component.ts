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
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });
  hide = true;
  validationMessages = {
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      {
        type: 'minlength',
        message: 'Password must be at least 6 characters long'
      }
    ]
  };

  constructor(private readonly authService: AuthService) {}

  signIn() {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.authService.emailAuth(email, password);
    }
  }
}
