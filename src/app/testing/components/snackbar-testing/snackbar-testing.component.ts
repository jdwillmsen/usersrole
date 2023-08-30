import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import { Icon, Variant } from 'src/app/core/models/alert.model';
import { SnackbarOptions } from 'src/app/core/models/snackbar.model';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';

@Component({
  selector: 'app-snackbar-testing',
  templateUrl: './snackbar-testing.component.html',
  styleUrls: ['./snackbar-testing.component.scss']
})
export class SnackbarTestingComponent {
  options: SnackbarOptions = {
    variant: 'filled',
    autoClose: false,
    autoCloseTimeout: 3000,
    icon: undefined,
    buttonText: undefined,
    direction: undefined,
    horizontalPosition: 'end',
    verticalPosition: 'bottom'
  };
  defaultIcons = false;
  message = 'Snackbar Message';
  horizontalPositionList: MatSnackBarHorizontalPosition[] = [
    'start',
    'end',
    'center',
    'left',
    'right'
  ];
  verticalPositionList: MatSnackBarVerticalPosition[] = ['top', 'bottom'];
  variantList: Variant[] = [
    {
      display: 'Default',
      value: 'default'
    },
    {
      display: 'Filled',
      value: 'filled'
    },
    {
      display: 'Outlined',
      value: 'outlined'
    }
  ];
  variant = new FormControl(this.variantList[1]);
  iconList: Icon[] = [
    {
      display: 'Delete',
      value: 'delete'
    },
    {
      display: 'Settings',
      value: 'settings'
    },
    {
      display: 'Search',
      value: 'shopping_cart'
    },
    {
      display: 'New Releases',
      value: 'new_releases'
    }
  ];

  constructor(protected snackbarService: SnackbarService) {}

  getOptions(): SnackbarOptions {
    this.options.variant = this.variant.value?.value;
    return { ...this.options };
  }
}
