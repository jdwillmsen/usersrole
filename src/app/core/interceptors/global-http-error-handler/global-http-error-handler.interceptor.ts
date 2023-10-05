import { Injectable } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { catchError, EMPTY, Observable, retry, throwError, timer } from 'rxjs';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { HTTP_403_MESSAGE } from '../../constants/http.constants';

@Injectable()
export class GlobalHttpErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private snackbarService: SnackbarService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry({
        count: 2,
        delay: (_, retryCount) => timer(retryCount * 1000)
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.snackbarService.error(
            HTTP_403_MESSAGE,
            { variant: 'filled' },
            true
          );
          return EMPTY;
        } else {
          return throwError(() => error);
        }
      })
    );
  }
}

export const GlobalHttpErrorHandlerInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: GlobalHttpErrorHandlerInterceptor,
  multi: true
};
