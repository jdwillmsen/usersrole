import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertTestingComponent } from './components/alert-testing/alert-testing.component';
import { SnackbarTestingComponent } from './components/snackbar-testing/snackbar-testing.component';
import { ButtonsTestingComponent } from './components/buttons-testing/buttons-testing.component';
import { authGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'alerts',
    component: AlertTestingComponent,
    canActivate: [authGuard]
  },
  {
    path: 'snackbars',
    component: SnackbarTestingComponent,
    canActivate: [authGuard]
  },
  {
    path: 'buttons',
    component: ButtonsTestingComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestingRoutingModule {}
