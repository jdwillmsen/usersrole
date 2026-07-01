import { TestBed } from '@angular/core/testing';
import {
  AuthTokenHttpInterceptorProvider,
  AuthTokenInterceptor
} from './auth-token.interceptor';
import { BehaviorSubject, Observable } from 'rxjs';
import { expect } from '@jest/globals';
import { HttpRequest } from '@angular/common/http';
import { AUTH } from '../../firebase.tokens';
import * as rxfireAuth from 'rxfire/auth';

describe('AuthTokenInterceptor', () => {
  let interceptor: AuthTokenInterceptor;
  const idToken$ = new BehaviorSubject<string | null>('mocked-id-token');

  beforeEach(() => {
    jest.spyOn(rxfireAuth, 'idToken').mockReturnValue(idToken$ as any);

    TestBed.configureTestingModule({
      providers: [
        AuthTokenInterceptor,
        {
          provide: AUTH,
          useValue: {}
        },
        AuthTokenHttpInterceptorProvider
      ]
    });

    interceptor = TestBed.inject(AuthTokenInterceptor);
  });

  it('should create an instance of AuthTokenInterceptor', () => {
    expect(interceptor).toBeInstanceOf(AuthTokenInterceptor);
  });

  it('should intercept requests and add an Authorization header with the idToken', (done) => {
    const request = new HttpRequest('GET', 'https://example.com/api/data');

    interceptor
      .intercept(request, {
        handle: (req: HttpRequest<unknown>) => {
          expect(req.headers.get('Authorization')).toEqual(
            'Bearer mocked-id-token'
          );
          done();
          return new Observable();
        }
      })
      .subscribe();

    idToken$.next('mocked-id-token');
  });
});
