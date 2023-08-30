import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { RoleGuard } from '../core/services/permissions/permissions.service';
import { redirectUnauthorizedToLogin } from '../app-routing.module';
import { RolesComponent } from './components/roles/roles.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
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
    path: 'roles',
    component: RolesComponent,
    canActivate: [AngularFireAuthGuard, RoleGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
      roles: ['manager', 'admin']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
