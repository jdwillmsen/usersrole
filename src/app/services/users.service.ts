import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role, User } from '../models/users.model';
import { SnackbarService } from './snackbar.service';

export type CreateUserRequest = {
  displayName: string;
  password: string;
  email: string;
  roles: Role[];
};
export type UpdateUserRequest = { uid: string } & CreateUserRequest;
export type DeleteUserRequest = { uid: string };

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = `${environment.functionsBaseUrl}/api/users`;
  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService
  ) {}

  get users$(): Observable<User[]> {
    return this.http.get<{ users: User[] }>(`${this.baseUrl}`).pipe(
      map((result) => {
        return result.users;
      }),
      catchError((error) => {
        this.snackbarService.error(error.error, { variant: 'filled' }, true);
        return EMPTY;
      })
    );
  }

  user$(id: string): Observable<User> {
    return this.http.get<{ user: User }>(`${this.baseUrl}/${id}`).pipe(
      map((result) => {
        return result.user;
      }),
      catchError((error) => {
        this.snackbarService.error(error.error, { variant: 'filled' }, true);
        return EMPTY;
      })
    );
  }

  create(user: CreateUserRequest) {
    return this.http.post(`${this.baseUrl}`, user).pipe(
      catchError((error) => {
        this.snackbarService.error(error.error.message, { variant: 'filled' }, true);
        return EMPTY;
      })
    );
  }

  edit(user: UpdateUserRequest) {
    return this.http.patch(`${this.baseUrl}/${user.uid}`, user).pipe(
      catchError((error) => {
        this.snackbarService.error(
          error.error.message,
          { variant: 'filled' },
          true
        );
        return EMPTY;
      })
    );
  }

  delete(user: DeleteUserRequest) {
    return this.http.delete(`${this.baseUrl}/${user.uid}`).pipe(
      catchError((error) => {
        this.snackbarService.error(
          error.error.message,
          { variant: 'filled' },
          true
        );
        return EMPTY;
      })
    );
  }
}
