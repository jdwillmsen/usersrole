import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { Auth } from 'firebase/auth';
import { idToken } from 'rxfire/auth';
import { AUTH } from '../../firebase.tokens';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(@Inject(AUTH) private auth: Auth) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return idToken(this.auth).pipe(
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
