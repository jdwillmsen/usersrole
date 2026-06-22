import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { UsersService } from '../users/users.service';
import { Auth } from 'firebase/auth';
import { user } from 'rxfire/auth';
import { map, of, switchMap } from 'rxjs';
import { SnackbarService } from '../snackbar/snackbar.service';
import { Role } from '../../models/users.model';
import { AUTH } from '../../firebase.tokens';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  roles: Role[] = [];

  constructor(
    private router: Router,
    private usersService: UsersService,
    @Inject(AUTH) private auth: Auth,
    private snackbarService: SnackbarService
  ) {
    this.getRole();
  }

  canActivateRole(next: ActivatedRouteSnapshot) {
    return user(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          return of(false);
        }
        return this.usersService.user$(user.uid).pipe(
          map((userDetails) => {
            const hasRequiredRole = next.data['roles'].some((role: Role) =>
              userDetails.roles.includes(role)
            );
            if (!hasRequiredRole) {
              this.router.navigate(['/forbidden']);
            }
            return hasRequiredRole;
          })
        );
      })
    );
  }

  hasRole(roles: Role[]): boolean {
    return roles.some((role: Role) => this.roles.includes(role));
  }

  getRole() {
    user(this.auth).subscribe({
      next: (user) => {
        if (user !== null) {
          this.usersService.user$(user.uid).subscribe((user) => {
            this.roles = user.roles;
          });
        }
      },
      error: (error) => {
        this.snackbarService.error(error.message, { variant: 'filled' }, true);
      }
    });
  }
}
