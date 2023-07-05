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

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  role = '';
  constructor(
    private router: Router,
    private usersService: UsersService,
    private afAuth: AngularFireAuth
  ) {
    this.getRole();
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.afAuth.user.pipe(
      switchMap((user) =>
        this.usersService
          .user$(user!.uid)
          .pipe(map((user) => {
            if (next.data['roles'].includes(user.role)) {
              return true;
            } else {
              this.router.navigate(['home']);
              return false;
            }
          }))
      )
    );
  }

  hasRole(roles: string[]): boolean {
    return roles.includes(this.role);
  }

  getUser() {
    return this.afAuth.user;
  }

  getRole() {
    this.getUser().subscribe((user) => {
      this.usersService.user$(user!.uid).subscribe((user) => {
        this.role = user.role;
      });
    });
  }
}

export const RoleGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(PermissionsService).canActivate(next, state);
};
