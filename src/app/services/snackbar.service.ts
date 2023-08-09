import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';
import { PaletteColors } from '../models/palette-colors.model';
import { SnackbarOptions } from '../models/snackbar.model';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private duration = 3000;
  private horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private snackbar: MatSnackBar) {}

  send(type: PaletteColors, message: string, options?: SnackbarOptions) {
    const panelClass = [];
    if (!options?.buttonText) panelClass.push('icon');
    if (options?.variant) panelClass.push(options.variant);
    this.snackbar.openFromComponent(SnackbarComponent, {
      data: {
        message: message,
        icon: options?.icon,
        buttonText: options?.buttonText
      },
      direction: options?.direction,
      duration: options?.autoClose
        ? options?.autoCloseTimeout
          ? options.autoCloseTimeout
          : this.duration
        : undefined,
      horizontalPosition:
        options?.horizontalPosition || this.horizontalPosition,
      verticalPosition: options?.verticalPosition || this.verticalPosition,
      panelClass: [...panelClass, type]
    });
  }

  success(message: string, options?: SnackbarOptions, defaultIcon = false) {
    if (defaultIcon) options = { ...options, icon: 'check_circle' };
    this.send('success', message, options);
  }

  error(message: string, options?: SnackbarOptions, defaultIcon = false) {
    if (defaultIcon) options = { ...options, icon: 'report' };
    this.send('error', message, options);
  }

  warn(message: string, options?: SnackbarOptions, defaultIcon = false) {
    if (defaultIcon) options = { ...options, icon: 'warning' };
    this.send('warn', message, options);
  }

  info(message: string, options?: SnackbarOptions, defaultIcon = false) {
    if (defaultIcon) options = { ...options, icon: 'info' };
    this.send('info', message, options);
  }

  clear() {
    this.snackbar.dismiss();
  }
}
