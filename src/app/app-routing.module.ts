import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo
} from '@angular/fire/compat/auth-guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/components/home/home.component';
import { SignInComponent } from './authentication/components/sign-in/sign-in.component';
import { UsersComponent } from './admin/components/users/users.component';
import { RoleGuard } from './core/services/permissions/permissions.service';
import { ProfileComponent } from './home/components/profile/profile.component';
import { SignUpComponent } from './authentication/components/sign-up/sign-up.component';
import { AlertTestingComponent } from './testing/components/alert-testing/alert-testing.component';
import { ButtonsTestingComponent } from './testing/components/buttons-testing/buttons-testing.component';
import { SnackbarTestingComponent } from './testing/components/snackbar-testing/snackbar-testing.component';
import { RolesComponent } from './admin/components/roles/roles.component';
import { ThemeTestingComponent } from './theme/components/theme-testing/theme-testing.component';
import { CreateThemeComponent } from './theme/components/create-theme/create-theme.component';

export const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(['login']);
export const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AngularFireAuthGuard, RoleGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
      roles: ['user']
    }
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AngularFireAuthGuard, RoleGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
      roles: ['manager', 'admin']
    }
  },
  {
    path: 'alerts',
    component: AlertTestingComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  },
  {
    path: 'snackbars',
    component: SnackbarTestingComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  },
  {
    path: 'buttons',
    component: ButtonsTestingComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  },
  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [AngularFireAuthGuard, RoleGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
      roles: ['manager', 'admin']
    }
  },
  {
    path: 'palettes',
    component: ThemeTestingComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  },
  {
    path: 'theme',
    component: CreateThemeComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToHome
    }
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToHome
    }
  },
  {
    path: '**',
    redirectTo: 'sign-in'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
