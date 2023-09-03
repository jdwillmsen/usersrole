import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../users/users.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, of, switchMap } from 'rxjs';
import { SnackbarService } from '../snackbar/snackbar.service';
import { Role } from '../../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  roles: Role[] = [];

  constructor(
    private router: Router,
    private usersService: UsersService,
    private afAuth: AngularFireAuth,
    private snackbarService: SnackbarService
  ) {
    this.getRole();
  }

  canActivateRole(next: ActivatedRouteSnapshot) {
    return this.afAuth.user.pipe(
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
    this.afAuth.user.subscribe({
      next: (user) => {
        if (user !== null) {
          this.usersService.user$(user.uid).subscribe((user) => {
            this.roles = user.roles;
          });
        }
      },
      error: (error) => {
        this.snackbarService.error(
          error.error.message,
          { variant: 'filled' },
          true
        );
      }
    });
  }
}

export const RoleGuard: CanActivateFn = (next: ActivatedRouteSnapshot) => {
  return inject(PermissionsService).canActivateRole(next);
};
