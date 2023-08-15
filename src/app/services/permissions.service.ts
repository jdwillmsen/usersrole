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
import { Role } from '../models/users.model';

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

  canActivateRole(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.afAuth.user.pipe(
      switchMap((user) =>
        this.usersService.user$(user!.uid).pipe(
          map((user) => {
            if (next.data['roles'].some((role: Role) => user.roles.includes(role))) {
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

  hasRole(roles: Role[]): boolean {
    return roles.some((role: Role) => this.roles.includes(role));
  }

  getRole() {
    this.afAuth.user.subscribe({
      next: (user) => {
        this.usersService.user$(user!.uid).subscribe((user) => {
          this.roles = user.roles;
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