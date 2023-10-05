import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { SnackbarService } from '../snackbar/snackbar.service';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  constructor(private snackbarService: SnackbarService, private zone: NgZone) {}

  handleError(error: unknown): void {
    this.zone.run(() => {
      this.snackbarService.error(
        'An error has occurred!',
        { variant: 'filled' },
        true
      );
    });
    console.warn(`Caught by Error Handler Service: `, error);
  }
}
