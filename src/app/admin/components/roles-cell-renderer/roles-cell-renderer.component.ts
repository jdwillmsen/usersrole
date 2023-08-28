import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Role } from 'src/app/core/models/users.model';

@Component({
  selector: 'app-roles-cell-renderer',
  templateUrl: './roles-cell-renderer.component.html',
  styleUrls: ['./roles-cell-renderer.component.scss']
})
export class RolesCellRendererComponent implements ICellRendererAngularComp {
  roles!: Role[];

  agInit(params: ICellRendererParams): void {
    this.roles = params.value;
  }

  refresh() {
    return false;
  }
}
