import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertTestingComponent } from './components/alert-testing/alert-testing.component';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { SnackbarTestingComponent } from './components/snackbar-testing/snackbar-testing.component';
import { ButtonsTestingComponent } from './components/buttons-testing/buttons-testing.component';
import { redirectUnauthorizedToLogin } from '../app-routing.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestingRoutingModule {}
