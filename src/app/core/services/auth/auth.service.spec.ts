import { AuthService } from './auth.service';
import { expect } from '@jest/globals';
import { of } from 'rxjs';

describe('AuthService', () => {
  let authService: AuthService;
  let angularFireAuthMock: jest.Mocked<any>;
  let routerMock: jest.Mocked<any>;
  let snackbarServiceMock: jest.Mocked<any>;

  beforeEach(() => {
    angularFireAuthMock = {
      authState: of(null),
      signInWithEmailAndPassword: jest.fn(),
      signInWithPopup: jest.fn(),
      signOut: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    snackbarServiceMock = {
      success: jest.fn(),
      error: jest.fn()
    };

    authService = new AuthService(
      angularFireAuthMock,
      routerMock,
      snackbarServiceMock
    );
  });

  it('should create an instance of AuthService', () => {
    expect(authService).toBeInstanceOf(AuthService);
  });
});
