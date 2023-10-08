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
import {
  CONFIRM_PASSWORD_REQUIRED_VALIDATION_MESSAGE,
  DISPLAY_NAME_REQUIRED_VALIDATION_MESSAGE,
  EMAIL_PATTERN_VALIDATION_MESSAGE,
  EMAIL_REQUIRED_VALIDATION_MESSAGE,
  EMAIL_VALIDATOR_PATTERN,
  PASSWORD_MATCH_VALIDATION_MESSAGE,
  PASSWORD_MIN_LENGTH_VALIDATION_MESSAGE,
  PASSWORD_REQUIRED_VALIDATION_MESSAGE,
  ROLES_REQUIRED_VALIDATION_MESSAGE
} from '../../../core/constants/message.constants';

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
        Validators.pattern(EMAIL_VALIDATOR_PATTERN)
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
      { type: 'required', message: EMAIL_REQUIRED_VALIDATION_MESSAGE },
      { type: 'pattern', message: EMAIL_PATTERN_VALIDATION_MESSAGE }
    ],
    displayName: [
      { type: 'required', message: DISPLAY_NAME_REQUIRED_VALIDATION_MESSAGE }
    ],
    roles: [{ type: 'required', message: ROLES_REQUIRED_VALIDATION_MESSAGE }],
    password: [
      { type: 'required', message: PASSWORD_REQUIRED_VALIDATION_MESSAGE },
      {
        type: 'minlength',
        message: PASSWORD_MIN_LENGTH_VALIDATION_MESSAGE
      }
    ],
    confirmPassword: [
      {
        type: 'required',
        message: CONFIRM_PASSWORD_REQUIRED_VALIDATION_MESSAGE
      },
      {
        type: 'minlength',
        message: PASSWORD_MIN_LENGTH_VALIDATION_MESSAGE
      }
    ],
    matchingPassword: [
      { type: 'passwordMatch', message: PASSWORD_MATCH_VALIDATION_MESSAGE }
    ]
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
  displayRoles = '';

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
          this.displayRoles = user.roles
            .map((role) => capitalizeFirstLetter(role))
            .join(', ');
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

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
