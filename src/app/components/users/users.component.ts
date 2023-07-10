import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, Observable, catchError, filter, switchMap } from 'rxjs';
import { User } from 'src/app/models/users.model';
import { UserFormService } from 'src/app/services/user-form.service';
import { UsersService } from 'src/app/services/users.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users$!: Observable<User[]>;
  user$!: Observable<User>;

  constructor(
    private userService: UsersService,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private userFormService: UserFormService,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit() {
    this.users$ = this.userService.users$;

    this.user$ = this.afAuth.user.pipe(
      filter((user) => !!user),
      switchMap((user) => this.userService.user$(user!.uid)),
      catchError((error) => {
        this.snackBarService.showSnackbar(error.error, 'Ok', 'error');
        return EMPTY;
      })
    );
  }

  create() {
    this.userFormService.create();
    const dialogRef = this.dialog.open(UserFormComponent, { minWidth: 350 });
    dialogRef.afterClosed().subscribe({
      next: (user) => {
        if (user) {
          this.userService.create(user).subscribe(() => {
            this.snackBarService.showSnackbar(
              'User Created Successfully',
              'Ok',
              'success',
              3000
            );
          });
        }
      },
      error: (error) => {
        this.snackBarService.showSnackbar(error.error, 'Ok', 'error');
      }
    });
  }

  edit(userToEdit: any) {
    this.userFormService.edit(userToEdit);
    const dialogRef = this.dialog.open(UserFormComponent, { minWidth: 350 });
    dialogRef.afterClosed().subscribe({
      next: (user) => {
        if (user) {
          this.userService.edit(user).subscribe(() => {
            this.snackBarService.showSnackbar(
              'User Edited Successfully',
              'Ok',
              'success',
              3000
            );
          });
        }
      },
      error: (error) => {
        this.snackBarService.showSnackbar(error.error, 'Ok', 'error');
      }
    });
  }
}
