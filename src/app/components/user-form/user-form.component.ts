import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, tap } from 'rxjs';
import { UserFormService } from 'src/app/services/user-form.service';

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
    roles: new FormControl([])
  });
  title$!: Observable<string>;
  user$!: Observable<any>;

  constructor(
    private dialogRef: MatDialogRef<UserFormComponent>,
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
    this.dialogRef.close();
  }

  save() {
    const { displayName, email, roles, password, uid } = this.form.value;
    this.dialogRef.close({ displayName, email, roles, password, uid });
  }
}
