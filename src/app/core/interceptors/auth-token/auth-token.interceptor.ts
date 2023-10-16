import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private auth: AngularFireAuth) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.auth.idToken.pipe(
      take(1),
      switchMap((idToken) => {
        let clone = request.clone();
        if (idToken) {
          clone = clone.clone({
            headers: request.headers.set('Authorization', 'Bearer ' + idToken)
          });
        }
        return next.handle(clone);
      })
    );
  }
}

export const AuthTokenHttpInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthTokenInterceptor,
  multi: true
};
