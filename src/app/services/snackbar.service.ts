import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  showSnackbar(
    displayMessage: string,
    buttonText: string,
    messageType: 'error' | 'success',
    duration?: number
  ) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message: displayMessage,
        buttonText: buttonText,
        messageType: messageType
      },
      duration: duration,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: messageType
    });
  }
}
