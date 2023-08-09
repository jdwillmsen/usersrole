import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { UsersService } from './users.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, switchMap } from 'rxjs';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  role = '';
  constructor(
    private router: Router,
    private usersService: UsersService,
    private afAuth: AngularFireAuth,
    private snackbarService: SnackbarService
  ) {
    this.getRole();
  }

  canActivateRole(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.afAuth.user.pipe(
      switchMap((user) =>
        this.usersService.user$(user!.uid).pipe(
          map((user) => {
            if (next.data['roles'].includes(user.role)) {
              return true;
            } else {
              this.router.navigate(['home']);
              return false;
            }
          })
        )
      )
    );
  }

  hasRole(roles: string[]): boolean {
    return roles.includes(this.role);
  }

  getRole() {
    this.afAuth.user.subscribe({
      next: (user) => {
        this.usersService.user$(user!.uid).subscribe((user) => {
          this.role = user.role;
        });
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

export const RoleGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(PermissionsService).canActivateRole(next, state);
};
