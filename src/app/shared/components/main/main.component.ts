import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavItem } from 'src/app/shared/models/nav-item.model';
import { Role } from 'src/app/core/models/users.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PermissionsService } from 'src/app/core/services/permissions/permissions.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import firebase from 'firebase/compat/app';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { MatListModule } from '@angular/material/list';
import { NgFor, NgIf } from '@angular/common';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  standalone: true,
  imports: [
    MatSidenavModule,
    NgIf,
    MatListModule,
    NgFor,
    NavItemComponent,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule
  ]
})
export class MainComponent {
  @Input() sideNavMode: MatDrawerMode = 'side';
  @Input() isSideNavOpened = true;
  @Output() onSideNavChange = new EventEmitter<boolean>();
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
      path: '/testing/alerts',
      icon: 'notification_important',
      title: 'Alerts'
    },
    {
      path: '/testing/snackbars',
      icon: 'announcement',
      title: 'Snackbars'
    },
    {
      path: '/testing/buttons',
      icon: 'ballot',
      title: 'Buttons'
    },
    {
      path: '/theme/view',
      icon: 'format_color_fill',
      title: 'Palettes'
    },
    {
      path: '/theme/create',
      icon: 'color_lens',
      title: 'Theme'
    },
    {
      path: '/admin/users',
      icon: 'supervised_user_circle',
      title: 'Users',
      roles: ['read', 'admin', 'manager']
    },
    {
      path: '/admin/roles',
      icon: 'lock',
      title: 'Roles',
      roles: ['read', 'admin', 'manager']
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

  openedChanged(isOpen: boolean) {
    this.onSideNavChange.emit(isOpen);
  }
}
