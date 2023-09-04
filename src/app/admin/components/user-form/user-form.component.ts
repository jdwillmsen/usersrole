import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable, tap } from 'rxjs';
import { Role, User } from 'src/app/core/models/users.model';
import {
  ActionType,
  UserFormService
} from 'src/app/admin/services/user-form/user-form.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { RoleOption } from '../roles/roles.component';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgClass,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    NgForOf
  ]
})
export class UserFormComponent implements OnInit {
  hide = true;
  form = new FormGroup({
    uid: new FormControl(''),
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
    roles: new FormControl<Role[]>([], {
      nonNullable: true,
      validators: [Validators.required]
    }),
    lastSignInTime: new FormControl(''),
    creationTime: new FormControl(''),
    matchingPassword: new FormGroup(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6)
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(6)
        ])
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
    roles: [{ type: 'required', message: 'Roles is required' }],
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
    matchingPassword: [{ type: 'passwordMatch', message: 'Password mismatch' }]
  };
  rolesOptions: RoleOption[] = [
    {
      value: 'admin',
      display: 'Admin'
    },
    {
      value: 'manager',
      display: 'Manager'
    },
    {
      value: 'user',
      display: 'User'
    },
    {
      value: 'read',
      display: 'Read'
    }
  ];
  title$!: Observable<string>;
  user$!: Observable<User>;
  type$!: Observable<ActionType>;

  constructor(
    private dialogRef: MatDialogRef<UserFormComponent>,
    private userForm: UserFormService
  ) {}

  ngOnInit(): void {
    this.type$ = this.userForm.type$;
    this.title$ = this.userForm.title$;
    this.user$ = this.userForm.user$.pipe(
      tap((user) => {
        if (user) {
          this.form.patchValue(user);
        } else {
          this.form.reset({});
        }
      })
    );
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    const { displayName, email, roles, uid } = this.form.value;
    const password = this.form.value.matchingPassword
      ? this.form.value.matchingPassword.password
      : '';
    this.dialogRef.close({ displayName, email, roles, password, uid });
  }

  passwordMatch(): ValidatorFn {
    return () => {
      const matches =
        this.form?.controls.matchingPassword.get('password')?.value ===
        this.form?.controls.matchingPassword.get('confirmPassword')?.value;
      return !matches ? { passwordMatch: true } : null;
    };
  }

  getErrorMessage(
    formControlName: 'email' | 'displayName' | 'roles' | 'matchingPassword'
  ) {
    for (const validation of this.validationMessages[formControlName]) {
      if (this.form.get(formControlName)?.hasError(validation.type)) {
        return validation.message;
      }
    }
    return '';
  }

  getPasswordErrorMessage(formControlName: 'password' | 'confirmPassword') {
    for (const validation of this.validationMessages[formControlName]) {
      if (
        this.form
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