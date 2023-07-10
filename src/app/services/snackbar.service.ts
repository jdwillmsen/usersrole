import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../components/custom-snackbar/custom-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  showSnackbar(displayMessage: string, buttonText: string, messageType: 'error' | 'success', duration?: number) {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
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
