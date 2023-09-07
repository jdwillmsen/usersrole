import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../../../core/models/users.model';

export type ActionType = 'Create' | 'View' | 'Delete' | 'Edit' | 'Unknown';

@Injectable({
  providedIn: 'root'
})
export class UserFormService {
  defaultUser: User = {
    uid: '',
    displayName: '',
    roles: [],
    email: ''
  };
  private _behaviorSubject = new BehaviorSubject<{
    title: string;
    user: User;
    type: ActionType;
  }>({
    title: '',
    user: this.defaultUser,
    type: 'Unknown'
  });

  get title$() {
    return this._behaviorSubject
      .asObservable()
      .pipe(map((userForm) => userForm.title));
  }

  get user$() {
    return this._behaviorSubject
      .asObservable()
      .pipe(map((userForm) => userForm.user));
  }

  get type$() {
    return this._behaviorSubject
      .asObservable()
      .pipe(map((userForm) => userForm.type));
  }

  edit(user: User) {
    this._behaviorSubject.next({ title: 'Edit User', user, type: 'Edit' });
  }

  create() {
    this._behaviorSubject.next({
      title: 'Create User',
      user: this.defaultUser,
      type: 'Create'
    });
  }

  view(user: User) {
    this._behaviorSubject.next({ title: 'View User', user, type: 'View' });
  }

  delete(user: User) {
    this._behaviorSubject.next({ title: 'Delete User', user, type: 'Delete' });
  }
}
