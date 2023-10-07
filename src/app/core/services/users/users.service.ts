import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { Role, User } from '../../models/users.model';
import { SnackbarService } from '../snackbar/snackbar.service';
import { environment } from '../../../../environments/environment';
import { handleError } from '../error-handler/error-handler.service';

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
      map((result) => result.users),
      catchError((error) => this.handleError(error))
    );
  }

  user$(id: string): Observable<User> {
    return this.http.get<{ user: User }>(`${this.baseUrl}/${id}`).pipe(
      map((result) => result.user),
      catchError((error) => this.handleError(error))
    );
  }

  create(user: CreateUserRequest) {
    return this.http
      .post(`${this.baseUrl}`, user)
      .pipe(catchError((error) => this.handleError(error)));
  }

  createAdmin(user: CreateUserRequest) {
    return this.http
      .post(`${this.baseUrl}/admin`, user)
      .pipe(catchError((error) => this.handleError(error)));
  }

  edit(user: UpdateUserRequest) {
    return this.http
      .patch(`${this.baseUrl}/${user.uid}`, user)
      .pipe(catchError((error) => this.handleError(error)));
  }

  delete(user: DeleteUserRequest) {
    return this.http
      .delete(`${this.baseUrl}/${user.uid}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  handleError(error: any) {
    return handleError(error, this.snackbarService);
  }
}
