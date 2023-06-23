import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, filter, switchMap } from 'rxjs';
import { User } from 'src/app/models/users.model';
import { UsersService } from 'src/app/services/users.service';

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
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.users$ = this.userService.users$;

    this.user$ = this.afAuth.user.pipe(
      filter((user) => !!user),
      switchMap((user) => this.userService.user$(user!.uid))
    );
  }
}
