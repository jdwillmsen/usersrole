import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SnackbarService } from '../../../core/services/snackbar/snackbar.service';
import { Role } from '../../../core/models/users.model';
import { catchError, EMPTY } from 'rxjs';

export type UpdateUserRolesRequest = { uid: string; roles: Role[] };

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private baseUrl = `${environment.functionsBaseUrl}/api/users`;

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService
  ) {}

  update(user: UpdateUserRolesRequest) {
    return this.http.patch(`${this.baseUrl}/roles/${user.uid}`, user).pipe(
      catchError((error) => {
        this.snackbarService.error(error.error, { variant: 'filled' }, true);
        return EMPTY;
      })
    );
  }
}
