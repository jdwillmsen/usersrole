import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { filter, Observable, switchMap, tap } from 'rxjs';
import { Auth, User as FirebaseUser } from 'firebase/auth';
import { user } from 'rxfire/auth';
import { UsersService } from 'src/app/core/services/users/users.service';
import { Role, User } from 'src/app/core/models/users.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe } from '@angular/common';
import { AUTH } from 'src/app/core/firebase.tokens';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
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
    roles: new FormControl<Role[]>([])
  });
  user$!: Observable<User>;
  displayRoles = '';

  constructor(
    @Inject(AUTH) private auth: Auth,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.user$ = user(this.auth).pipe(
      filter((user): user is FirebaseUser => !!user),
      switchMap((user) =>
        this.usersService.user$(user.uid).pipe(
          tap((user) => {
            if (user) {
              this.profileForm.patchValue(user);
              this.displayRoles = user.roles
                .map((role) => capitalizeFirstLetter(role))
                .join(', ');
            }
          })
        )
      )
    );
  }
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
