import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { SnackbarService } from '../snackbar/snackbar.service';
import { DEFAULT_ERROR_MESSAGE } from '../../constants/message.constants';
import { EMPTY } from 'rxjs';
import firebase from 'firebase/compat';
import FirebaseError = firebase.FirebaseError;

interface AngularFireError extends Error {
  rejection: FirebaseError;
}

function errorIsAngularFireError(err: any): err is AngularFireError {
  return err.rejection && err.rejection.name === 'FirebaseError';
}

// Not providedIn 'root': needs special handling in app.config to override default error handler.
@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  constructor(private snackbarService: SnackbarService, private zone: NgZone) {}

  handleError(error: unknown): void {
    if (!errorIsAngularFireError(error)) {
      this.zone.run(() => {
        this.snackbarService.error(
          DEFAULT_ERROR_MESSAGE,
          { variant: 'filled' },
          true
        );
      });
      console.warn(`Caught by Error Handler Service: `, error);
    }
  }
}

export const handleError = (error: any, snackbarService: SnackbarService) => {
  let errorMessage = DEFAULT_ERROR_MESSAGE;
  if (typeof error.error === 'object' && error.error.message) {
    errorMessage = error.error.message;
  } else if (typeof error.error === 'string' && error.error) {
    errorMessage = error.error;
  }
  snackbarService.error(errorMessage, { variant: 'filled' }, true);
  return EMPTY;
};
