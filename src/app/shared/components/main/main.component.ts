import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { NavItem } from 'src/app/shared/models/nav-item.model';
import { Role } from 'src/app/core/models/users.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PermissionsService } from 'src/app/core/services/permissions/permissions.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { MatListModule } from '@angular/material/list';

import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [
    MatSidenavModule,
    MatListModule,
    NavItemComponent,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule
  ]
})
export class MainComponent {
  @Input() sideNavMode: MatDrawerMode = 'side';
  @Input() isSideNavOpened = true;
  @Output() sideNavChange = new EventEmitter<boolean>();
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
  private authService = inject(AuthService);
  private permissionsService = inject(PermissionsService);
  private snackbarService = inject(SnackbarService);

  user = toSignal(
    this.authService.user$.pipe(
      catchError((error) => {
        this.snackbarService.error(error.error, { variant: 'filled' }, true);
        return EMPTY;
      })
    ),
    { initialValue: null }
  );

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
    this.sideNavChange.emit(isOpen);
  }
}
