import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, tap } from 'rxjs';
import { UserFormService } from 'src/app/services/user-form.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl(''),
    displayName: new FormControl(''),
    password: new FormControl(''),
    role: new FormControl('')
  });
  title$: Observable<string>;
  user$: Observable<{}>;

  constructor(
    private dialog: MatDialog,
    private usersService: UsersService,
    private userForm: UserFormService
  ) {}

  ngOnInit(): void {
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
    this.dialog.closeAll();
  }
}
