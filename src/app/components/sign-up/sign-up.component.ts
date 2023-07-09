import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
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
      validators: [Validators.required, Validators.email]
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
      { type: 'email', message: 'Enter a valid email' }
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

  constructor(private usersService: UsersService) {}

  signUp() {
    if (this.signUpForm.valid) {
      const email = this.signUpForm.get('email')!.value;
      const displayName = this.signUpForm.get('displayName')!.value;
      const password = this.signUpForm
        .get('matchingPassword')!
        .get('password')!.value;
      const role = 'user';
      const user: CreateUserRequest = { email, displayName, password, role };
      this.usersService.create(user).subscribe(() => {
        console.log('Sign Up Successful');
      });
      alert('Sign Up Presed');
    } else {
      alert('Sign Up Form Error');
    }

    console.log(this.signUpForm.value);
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
