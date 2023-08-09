/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import {
  CreateUserRequest,
  UsersService
} from 'src/app/services/users.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
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
      },
      { type: 'passwordMatch', message: 'Password mismatch' }
    ]
  };

  constructor(
    private usersService: UsersService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  signUp() {
    if (this.signUpForm.valid) {
      const email = this.signUpForm.get('email')!.value;
      const displayName = this.signUpForm.get('displayName')!.value;
      const password = this.signUpForm
        .get('matchingPassword')!
        .get('password')!.value;
      const role = 'user';
      const user: CreateUserRequest = { email, displayName, password, role };
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

  passwordMatch(): ValidatorFn {
    return () => {
      const matches =
        this.signUpForm?.controls.matchingPassword.get('password')?.value ===
        this.signUpForm?.controls.matchingPassword.get('confirmPassword')
          ?.value;
      return !matches ? { passwordMatch: true } : null;
    };
  }
}
