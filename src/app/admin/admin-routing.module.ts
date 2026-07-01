import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { authGuard } from '../core/guards/auth.guard';
import { RolesComponent } from './components/roles/roles.component';
import { RoleGuard } from '../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard, RoleGuard],
    data: {
      roles: ['read', 'manager', 'admin']
    }
  },
  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [authGuard, RoleGuard],
    data: {
      roles: ['read', 'manager', 'admin']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
