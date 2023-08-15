import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Role, User } from 'src/app/models/users.model';
import { RolesService } from 'src/app/services/roles.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  rolesForm = new FormGroup(
    {
      usersName: new FormControl<string | User>('', {
        nonNullable: true,
        validators: [Validators.required, userSelectionRequiredValidator]
      }),
      roles: new FormControl<Role[]>([], {
        nonNullable: true,
        validators: [Validators.required]
      })
    },
    { validators: this.rolesAreDifferent() }
  );
  options$!: Observable<User[]>;
  filteredOptions$!: Observable<User[]>;
  private filteredOptionsSubject = new BehaviorSubject<User[]>([]);

  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.filteredOptions$ = this.filteredOptionsSubject.asObservable();
    this.options$ = this.usersService.users$.pipe(
      tap((users) => {
        this.filteredOptionsSubject.next(users);
      })
    );
    this.rolesForm.controls.usersName.valueChanges.subscribe((user) => {
      if (user && typeof user !== 'string')
        this.rolesForm.controls.roles.setValue(user.roles);
    });
  }

  displayFn(rolesOption: User): string {
    return rolesOption && rolesOption.displayName
      ? `${rolesOption.displayName} (${rolesOption.uid})`
      : '';
  }

  resetForm() {
    this.rolesForm.reset();
  }

  onAutocompleteKeyUp(searchText: string, options: User[]): void {
    const lowerSearchText = searchText.toLowerCase();
    this.filteredOptionsSubject.next(
      !lowerSearchText
        ? options
        : options.filter((option) =>
            option.displayName.toLowerCase().includes(lowerSearchText)
          )
    );
  }

  onAssign() {
    if (
      typeof this.rolesForm.controls.usersName.value !== 'string' &&
      this.rolesForm.valid
    ) {
      this.rolesService
        .update({
          uid: this.rolesForm.controls.usersName.value.uid,
          roles: this.rolesForm.controls.roles.value
        })
        .subscribe({
          next: () => {
            this.snackbarService.success(
              'Roles Assigned Successfully',
              {
                variant: 'filled',
                autoClose: true
              },
              true
            );
          },
          error: (error) => {
            this.snackbarService.error(
              error.error,
              { variant: 'filled' },
              true
            );
          }
        });
    }
  }

  rolesAreDifferent(): ValidatorFn {
    const compareArrays = (arr1: Role[], arr2: Role[]) =>
      arr1 &&
      arr2 &&
      arr1.length === arr2.length &&
      arr1.every((role, index) => role === arr2[index]);
    return () => {
      const matches =
        typeof this.rolesForm?.controls.usersName?.value !== 'string'
          ? compareArrays(
              this.rolesForm?.controls.usersName?.value.roles,
              this.rolesForm?.controls.roles?.value
            )
          : false;
      return matches ? { noMatchRequired: true } : null;
    };
  }
}

function instanceOfUser(user: any): user is User {
  return (
    !!user && typeof user !== 'string' && 'displayName' in user && 'uid' in user
  );
}

const userSelectionRequiredValidator: ValidatorFn = (
  control: AbstractControl
) => {
  return !instanceOfUser(control?.value) ? { matchRequired: true } : null;
};
