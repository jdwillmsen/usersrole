import { Component } from '@angular/core';
import { NavItem } from 'src/app/models/nav-item.model';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

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
    }
  ];
  user: any;

  constructor(
    private authService: AuthService,
    private permissionsService: PermissionsService,
    private snackBarService: SnackbarService
  ) {
    authService.user$.subscribe({
      next: (user) => (this.user = user),
      error: (error) =>
        this.snackBarService.showSnackbar(error.error, 'Ok', 'error')
    });
  }

  checkRoles(roles: string[] | undefined): boolean {
    if (roles == undefined || roles.length == 0) {
      return true;
    }
    return this.permissionsService.hasRole(roles);
  }

  toggleSideNav() {
    this.isExpanded = !this.isExpanded;
  }
}
