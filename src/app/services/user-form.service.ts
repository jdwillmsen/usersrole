import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, catchError, map } from 'rxjs';
import { SnackbarService } from './snackbar.service';
import { User } from '../models/users.model';

export type ActionType = 'Create' | 'View' | 'Delete' | 'Edit' | 'Unknown';

@Injectable({
  providedIn: 'root'
})
export class UserFormService {
  constructor(private snackbarService: SnackbarService) {}

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

  get title$() {
    return this._behaviorSubject.asObservable().pipe(
      map((userForm) => userForm.title),
      catchError((error) => {
        this.snackbarService.error(error.error, { variant: 'filled' }, true);
        return EMPTY;
      })
    );
  }

  get user$() {
    return this._behaviorSubject.asObservable().pipe(
      map((userForm) => userForm.user),
      catchError((error) => {
        this.snackbarService.error(error.error, { variant: 'filled' }, true);
        return EMPTY;
      })
    );
  }

  get type$() {
    return this._behaviorSubject.asObservable().pipe(
      map((userForm) => userForm.type),
      catchError((error) => {
        this.snackbarService.error(error.error, { variant: 'filled' }, true);
        return EMPTY;
      })
    );
  }
}
