import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { Observable, filter, switchMap } from 'rxjs';
import { User } from 'src/app/models/users.model';
import { UserFormService } from 'src/app/services/user-form.service';
import { UsersService } from 'src/app/services/users.service';
import { UserFormComponent } from '../user-form/user-form.component';

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
    private userFormService: UserFormService
  ) {}

  ngOnInit() {
    this.users$ = this.userService.users$;

    this.user$ = this.afAuth.user.pipe(
      filter((user) => !!user),
      switchMap((user) => this.userService.user$(user!.uid))
    );
  }

  create() {
    this.userFormService.create();
    const dialogRef = this.dialog.open(UserFormComponent, { minWidth: 350});
    dialogRef.afterClosed().subscribe((user) => {
      if (user) {
        this.userService.create(user).subscribe((_) => {
          console.log('User created');
        });
      }
    });
  }

  edit(userToEdit: any) {
    this.userFormService.edit(userToEdit);
    const dialogRef = this.dialog.open(UserFormComponent, { minWidth: 350 });
    dialogRef.afterClosed().subscribe((user) => {
      if (user) {
        this.userService.edit(user).subscribe((_) => {
          console.log('User edited');
        });
      }
    });
  }
}
