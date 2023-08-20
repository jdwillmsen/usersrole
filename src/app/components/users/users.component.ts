import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/users.model';
import { UserFormService } from 'src/app/services/user-form.service';
import { UsersService } from 'src/app/services/users.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ColDef, FirstDataRenderedEvent, GridOptions } from 'ag-grid-community';
import { ActionsButtonCellRendererComponent } from '../actions-button-cell-renderer/actions-button-cell-renderer.component';
import { RolesCellRendererComponent } from '../roles-cell-renderer/roles-cell-renderer.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private dateSortComparator = (stringDate1: string, stringDate2: string) => {
    const date1 = new Date(stringDate1);
    const date2 = new Date(stringDate2);
    if (date1 === null && date2 === null) return 0;
    if (date1 === null) return -1;
    if (date2 === null) return 1;
    return date1.getTime() - date2.getTime();
  };
  private dateFilterComparator = (
    filterLocalDateAtMidnight: Date,
    cellValue: string
  ) => {
    if (cellValue === null) return -1;
    const cellDate = new Date(cellValue);
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) return 0;
    if (cellDate < filterLocalDateAtMidnight) return -1;
    if (cellDate > filterLocalDateAtMidnight) return 1;
    return 0;
  };
  users$!: Observable<User[]>;
  columnDefs: ColDef[] = [
    { field: 'uid', cellDataType: 'text' },
    { field: 'email', cellDataType: 'text' },
    { field: 'displayName', cellDataType: 'text' },
    {
      field: 'roles',
      cellRenderer: RolesCellRendererComponent,
      cellDataType: 'text'
    },
    {
      field: 'lastSignInTime',
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: this.dateFilterComparator
      },
      comparator: this.dateSortComparator,
      cellDataType: 'text'
    },
    {
      field: 'creationTime',
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: this.dateFilterComparator
      },
      comparator: this.dateSortComparator,
      cellDataType: 'text'
    },
    {
      field: 'actions',
      autoHeight: true,
      cellRenderer: ActionsButtonCellRendererComponent,
      maxWidth: 180,
      minWidth: 180,
      resizable: false,
      filter: false,
      sortable: false
    }
  ];
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    cellStyle: {
      display: 'flex',
      'align-items': 'center',
      'white-space': 'nowrap',
      'text-overflow': 'ellipsis',
      overflow: 'hidden'
    }
  };
  public gridOptions: GridOptions = {
    columnDefs: this.columnDefs,
    defaultColDef: this.defaultColDef,
    pagination: true,
    rowSelection: 'multiple',
    animateRows: true,
    enableCellTextSelection: true
  };

  constructor(
    private userService: UsersService,
    private dialog: MatDialog,
    private userFormService: UserFormService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.users$ = this.userService.users$;
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  create() {
    this.userFormService.create();
    const dialogRef = this.dialog.open(UserFormComponent, { minWidth: 350 });
    dialogRef.afterClosed().subscribe({
      next: (user) => {
        if (user) {
          this.userService.create(user).subscribe(() => {
            this.snackbarService.success(
              'User Created Successfully',
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
