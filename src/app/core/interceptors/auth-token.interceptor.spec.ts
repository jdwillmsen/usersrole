import { TestBed } from '@angular/core/testing';
import { AuthTokenInterceptor } from './auth-token.interceptor';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

describe('AuthTokenInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        AuthTokenInterceptor,
        {
          provide: AngularFireAuth,
          useValue: {
            idToken: of('mockedToken')
          }
        }
      ]
    })
  );

  it('should be created', () => {
    const interceptor: AuthTokenInterceptor =
      TestBed.inject(AuthTokenInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
