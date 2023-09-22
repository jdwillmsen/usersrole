import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Role } from 'src/app/core/models/users.model';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import {
  CreateUserRequest,
  UsersService
} from 'src/app/core/services/users/users.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ]
})
export class SignUpComponent {
  hide = true;
  signUpForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
      ]
    }),
    displayName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    matchingPassword: new FormGroup(
      {
        password: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(6)]
        }),
        confirmPassword: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(6)]
        })
      },
      { validators: this.passwordMatch() }
    )
  });
  validationMessages = {
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    displayName: [{ type: 'required', message: 'Display name is required' }],
    password: [
      { type: 'required', message: 'Password is required' },
      {
        type: 'minlength',
        message: 'Password must be at least 6 characters long'
      }
    ],
    confirmPassword: [
      { type: 'required', message: 'Confirm password is required' },
      {
        type: 'minlength',
        message: 'Password must be at least 6 characters long'
      }
    ],
    matchingPassword: [
      { type: 'passwordMatch', message: 'Passwords must match' }
    ]
  };

  constructor(
    private usersService: UsersService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  signUp() {
    const emailControl = this.signUpForm.get('email');
    const displayNameControl = this.signUpForm.get('displayName');
    const matchingPasswordControl = this.signUpForm.get('matchingPassword');
    if (
      emailControl &&
      displayNameControl &&
      matchingPasswordControl &&
      emailControl.valid &&
      displayNameControl.valid &&
      matchingPasswordControl.valid
    ) {
      const email = emailControl.value;
      const displayName = displayNameControl.value;
      const passwordControl = matchingPasswordControl.get('password');
      if (passwordControl) {
        const password = passwordControl.value;
        const roles: Role[] = ['user'];
        const user: CreateUserRequest = { email, displayName, password, roles };
        this.usersService.create(user).subscribe({
          next: () => {
            this.signUpForm.reset();
            this.snackbarService.success(
              'Sign Up Successful',
              {
                variant: 'filled',
                autoClose: true
              },
              true
            );
            this.router.navigate(['sign-in']);
          },
          error: (error) => {
            this.snackbarService.error(
              error.error.message,
              {
                variant: 'filled'
              },
              true
            );
          }
        });
      }
    }
  }

  passwordMatch(): ValidatorFn {
    return () => {
      const matches =
        this.signUpForm?.controls.matchingPassword.get('password')?.value ===
        this.signUpForm?.controls.matchingPassword.get('confirmPassword')
          ?.value;
      return !matches ? { passwordMatch: true } : null;
    };
  }

  getErrorMessage(
    formControlName: 'email' | 'displayName' | 'matchingPassword'
  ) {
    for (const validation of this.validationMessages[formControlName]) {
      if (this.signUpForm.get(formControlName)?.hasError(validation.type)) {
        return validation.message;
      }
    }
    return '';
  }

  getPasswordErrorMessage(formControlName: 'password' | 'confirmPassword') {
    for (const validation of this.validationMessages[formControlName]) {
      if (
        this.signUpForm
          .get('matchingPassword')
          ?.get(formControlName)
          ?.hasError(validation.type)
      ) {
        return validation.message;
      }
    }
    return '';
  }
}
