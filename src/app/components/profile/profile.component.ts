import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, filter, switchMap, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/users.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
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
