import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RolesService } from './services/roles/roles.service';
import { UserFormService } from './services/user-form/user-form.service';
import { ActionsButtonCellRendererComponent } from './components/actions-button-cell-renderer/actions-button-cell-renderer.component';
import { RolesComponent } from './components/roles/roles.component';
import { RolesCellRendererComponent } from './components/roles-cell-renderer/roles-cell-renderer.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UsersComponent } from './components/users/users.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    ActionsButtonCellRendererComponent,
    RolesComponent,
    RolesCellRendererComponent,
    UserFormComponent,
    UsersComponent
  ],
  providers: [RolesService, UserFormService],
  imports: [AdminRoutingModule, SharedModule, AgGridModule]
})
export class AdminModule {}
