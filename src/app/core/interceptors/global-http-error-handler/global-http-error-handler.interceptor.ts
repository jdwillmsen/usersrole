import { Injectable } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, retry, timer } from 'rxjs';

@Injectable()
export class GlobalHttpErrorHandlerInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry({
        count: 2,
        delay: (_, retryCount) => timer(retryCount * 1000)
      })
    );
  }
}

export const GlobalHttpErrorHandlerInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: GlobalHttpErrorHandlerInterceptor,
  multi: true
};
