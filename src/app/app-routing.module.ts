import {
  redirectLoggedInTo,
  redirectUnauthorizedTo
} from '@angular/fire/compat/auth-guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule)
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule)
  },
  {
    path: '',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      )
  },
  {
    path: 'testing',
    loadChildren: () =>
      import('./testing/testing.module').then((m) => m.TestingModule)
  },
  {
    path: 'theme',
    loadChildren: () =>
      import('./theme/theme.module').then((m) => m.ThemeModule)
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
