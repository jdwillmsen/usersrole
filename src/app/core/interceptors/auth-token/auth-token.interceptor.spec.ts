import { TestBed } from '@angular/core/testing';
import {
  AuthTokenHttpInterceptorProvider,
  AuthTokenInterceptor
} from './auth-token.interceptor';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { expect } from '@jest/globals';
import { HttpRequest } from '@angular/common/http';

describe('AuthTokenInterceptor', () => {
  let interceptor: AuthTokenInterceptor;
  let angularFireAuthMock: jest.Mocked<any> = {
    idToken: new BehaviorSubject<string | null>('mocked-id-token')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthTokenInterceptor,
        {
          provide: AngularFireAuth,
          useValue: angularFireAuthMock
        },
        AuthTokenHttpInterceptorProvider
      ]
    });

    interceptor = TestBed.inject(AuthTokenInterceptor);
    angularFireAuthMock = TestBed.inject(AngularFireAuth);
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

    angularFireAuthMock.idToken.next('mocked-id-token');
  });
});
