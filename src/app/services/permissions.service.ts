import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { UsersService } from './users.service';
import { User } from '../models/users.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, filter, switchMap } from 'rxjs';

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

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (next.data['roles'].includes(this.role)) {
      return true;
    } else {
      this.router.navigate(['home'])
      return false;
    }
  }

  hasRole(roles: string[]): boolean {
    return roles.includes(this.role);
  }

  getUser() {
    return this.afAuth.user;
  }

  getRole() {
     this.getUser().subscribe((user) => {
       this.usersService.user$(user!.uid).subscribe(user => {
         this.role = user.role;
      })
    })
  }
}

export const RoleGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return inject(PermissionsService).canActivate(next, state);
};
