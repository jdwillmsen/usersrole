import {
  AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo
} from '@angular/fire/compat/auth-guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { UsersComponent } from './components/users/users.component';
import { RoleGuard } from './services/permissions.service';
import { ProfileComponent } from './components/profile/profile.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

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
