import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserFormService {

  private _behaviorSubject = new BehaviorSubject<{title: string, user: any}>({ title: '', user: {} });

  edit(user: any) {
    this._behaviorSubject.next({ title: 'Edit User', user });
  }

  create() {
    this._behaviorSubject.next({ title: 'Create User', user: null });
  }

  get title$() {
    return this._behaviorSubject.asObservable().pipe(
      map(userForm => userForm.title)
    );
  }

  get user$() {
    return this._behaviorSubject.asObservable().pipe(
      map(userForm => userForm.user)
    );
  }

}
