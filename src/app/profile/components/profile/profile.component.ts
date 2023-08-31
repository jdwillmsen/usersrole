import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { filter, Observable, switchMap, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsersService } from 'src/app/core/services/users/users.service';
import { User } from 'src/app/core/models/users.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe
  ]
})
export class ProfileComponent implements OnInit {
  profileForm = new FormGroup({
    email: new FormControl(''),
    displayName: new FormControl(''),
    roles: new FormControl()
  });
  user$!: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.user$ = this.afAuth.user.pipe(
      filter((user) => !!user),
      switchMap((user) =>
        this.usersService.user$(user!.uid).pipe(
          tap((user) => {
            if (user) {
              this.profileForm.patchValue(user);
            }
          })
        )
      )
    );
  }
}
