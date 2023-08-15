import { Component } from '@angular/core';
import { NavItem } from 'src/app/models/nav-item.model';
import { Role } from 'src/app/models/users.model';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  isExpanded = false;
  navItems: NavItem[] = [
    {
      path: '/home',
      icon: 'home',
      title: 'Home'
    },
    {
      path: '/profile',
      icon: 'person',
      title: 'Profile',
      roles: ['user']
    },
    {
      path: '/users',
      icon: 'supervised_user_circle',
      title: 'Users',
      roles: ['admin', 'manager']
    },
    {
      path: '/roles',
      icon: 'lock',
      title: 'Roles',
      roles: ['admin', 'manager']
    },
    {
      path: '/alerts',
      icon: 'notification_important',
      title: 'Alerts'
    },
    {
      path: '/snackbars',
      icon: 'announcement',
      title: 'Snackbars'
    },
    {
      path: '/buttons',
      icon: 'ballot',
      title: 'Buttons'
    }
  ];
  user: firebase.User | null = null;

  constructor(
    private authService: AuthService,
    private permissionsService: PermissionsService,
    private snackbarService: SnackbarService
  ) {
    this.authService.user$.subscribe({
      next: (user) => (this.user = user),
      error: (error) =>
        this.snackbarService.error(error.error, { variant: 'filled' }, true)
    });
  }

  checkRoles(roles: Role[] | undefined): boolean {
    if (roles == undefined || roles.length == 0) {
      return true;
    }
    return this.permissionsService.hasRole(roles);
  }

  toggleSideNav() {
    this.isExpanded = !this.isExpanded;
  }
}
