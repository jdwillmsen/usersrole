import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { UserFormService } from 'src/app/services/user-form.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { User } from 'src/app/models/users.model';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-actions-button-cell-renderer',
  templateUrl: './actions-button-cell-renderer.component.html',
  styleUrls: ['./actions-button-cell-renderer.component.scss']
})
export class ActionsButtonCellRendererComponent
  implements ICellRendererAngularComp
{
  private params!: ICellRendererParams;

  constructor(
    private userService: UsersService,
    private dialog: MatDialog,
    private userFormService: UserFormService,
    private snackbarService: SnackbarService
  ) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  viewUser() {
    this.view(this.params.data);
  }

  editUser() {
    this.edit(this.params.data);
  }

  deleteUser() {
    this.delete(this.params.data);
  }

  refresh() {
    return false;
  }

  edit(userToEdit: User) {
    this.userFormService.edit(userToEdit);
    const dialogRef = this.dialog.open(UserFormComponent, { minWidth: 350 });
    dialogRef.afterClosed().subscribe({
      next: (user) => {
        if (user) {
          this.userService.edit(user).subscribe(() => {
            this.snackbarService.success(
              'User Edited Successfully',
              {
                variant: 'filled',
                autoClose: true
              },
              true
            );
          });
        }
      },
      error: (error) => {
        this.snackbarService.error(error.error, { variant: 'filled' }, true);
      }
    });
  }

  view(userToView: User) {
    this.userFormService.view(userToView);
    this.dialog.open(UserFormComponent, { minWidth: 350 });
  }

  delete(userToDelete: User) {
    this.userFormService.delete(userToDelete);
    const dialogRef = this.dialog.open(UserFormComponent, { minWidth: 350 });
    dialogRef.afterClosed().subscribe({
      next: (user) => {
        if (user) {
          this.userService.delete(user).subscribe(() => {
            this.snackbarService.success(
              'User Deleted Successfully',
              {
                variant: 'filled',
                autoClose: true
              },
              true
            );
          });
        }
      },
      error: (error) => {
        this.snackbarService.error(error.error, { variant: 'filled' }, true);
      }
    });
  }
}
