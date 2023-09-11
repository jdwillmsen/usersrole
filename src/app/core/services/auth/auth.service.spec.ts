import { AuthService } from './auth.service';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { GoogleAuthProvider } from 'firebase/auth';

describe('AuthService', () => {
  let authService: AuthService;
  const angularFireAuthMock: jest.Mocked<any> = {
    authState: of(null),
    signInWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
    signOut: jest.fn()
  };
  const routerMock: jest.Mocked<any> = {
    navigate: jest.fn()
  };
  const snackbarServiceMock: jest.Mocked<any> = {
    success: jest.fn(),
    error: jest.fn()
  };
  const authProviderMock = new GoogleAuthProvider();
  const defaultEmail = 'testUser@usersrole.com';
  const defaultPassword = 'testPassword';
  const defaultErrorMessage = 'Authentication Error';
  const defaultLoginSuccessMessage = 'Login Successful';
  const defaultLogoutSuccessMessage = 'Logout Successful';

  beforeEach(() => {
    authService = new AuthService(
      angularFireAuthMock,
      routerMock,
      snackbarServiceMock
    );
  });

  it('should create an instance of AuthService', () => {
    expect(authService).toBeInstanceOf(AuthService);
  });

  it('should have an initial user$ observable with null user', (done) => {
    authService.user$.subscribe((user) => {
      expect(user).toBeNull();
      done();
    });
  });

  it('should call emailAuth and navigate to home on success', (done) => {
    angularFireAuthMock.signInWithEmailAndPassword.mockResolvedValueOnce({});

    authService.emailAuth(defaultEmail, defaultPassword).subscribe(() => {
      expect(
        angularFireAuthMock.signInWithEmailAndPassword
      ).toHaveBeenCalledWith(defaultEmail, defaultPassword);
      expect(snackbarServiceMock.success).toHaveBeenCalledWith(
        defaultLoginSuccessMessage,
        { variant: 'filled', autoClose: true },
        true
      );
      expect(routerMock.navigate).toHaveBeenCalledWith(['home']);
      done();
    });
  });

  it('should call emailAuth and show error snackbar on failure', (done) => {
    angularFireAuthMock.signInWithEmailAndPassword.mockRejectedValueOnce({
      message: defaultErrorMessage
    });

    authService.emailAuth(defaultEmail, defaultPassword).subscribe(() => {
      expect(
        angularFireAuthMock.signInWithEmailAndPassword
      ).toHaveBeenCalledWith(defaultEmail, defaultPassword);
      expect(snackbarServiceMock.error).toHaveBeenCalledWith(
        defaultErrorMessage,
        { variant: 'filled' },
        true
      );
      done();
    });
  });

  it('should call googleAuth and navigate to home on success', (done) => {
    angularFireAuthMock.signInWithPopup.mockResolvedValueOnce({});

    authService.googleAuth().subscribe(() => {
      expect(angularFireAuthMock.signInWithPopup).toHaveBeenCalledWith(
        expect.any(GoogleAuthProvider)
      );
      expect(snackbarServiceMock.success).toHaveBeenCalledWith(
        defaultLoginSuccessMessage,
        { variant: 'filled', autoClose: true },
        true
      );
      expect(routerMock.navigate).toHaveBeenCalledWith(['home']);
      done();
    });
  });

  it('should call googleAuth and show error snackbar on failure', (done) => {
    angularFireAuthMock.signInWithPopup.mockRejectedValueOnce({
      message: defaultErrorMessage
    });

    authService.googleAuth().subscribe(() => {
      expect(angularFireAuthMock.signInWithPopup).toHaveBeenCalledWith(
        expect.any(GoogleAuthProvider)
      );
      expect(snackbarServiceMock.error).toHaveBeenCalledWith(
        defaultErrorMessage,
        { variant: 'filled' },
        true
      );
      done();
    });
  });

  it('should call authLogin and navigate to home on success', (done) => {
    angularFireAuthMock.signInWithPopup.mockResolvedValueOnce({});

    authService.authLogin(authProviderMock).subscribe(() => {
      expect(angularFireAuthMock.signInWithPopup).toHaveBeenCalledWith(
        authProviderMock
      );
      expect(snackbarServiceMock.success).toHaveBeenCalledWith(
        defaultLoginSuccessMessage,
        { variant: 'filled', autoClose: true },
        true
      );
      expect(routerMock.navigate).toHaveBeenCalledWith(['home']);
      done();
    });
  });

  it('should call authLogin and show error snackbar on failure', (done) => {
    angularFireAuthMock.signInWithPopup.mockRejectedValueOnce({
      message: defaultErrorMessage
    });

    authService.authLogin(authProviderMock).subscribe(() => {
      expect(angularFireAuthMock.signInWithPopup).toHaveBeenCalledWith(
        authProviderMock
      );
      expect(snackbarServiceMock.error).toHaveBeenCalledWith(
        defaultErrorMessage,
        { variant: 'filled' },
        true
      );
      done();
    });
  });

  it('should call authLogout and navigate to sign-in on success', (done) => {
    angularFireAuthMock.signOut.mockResolvedValueOnce({});

    authService.authLogout().subscribe(() => {
      expect(angularFireAuthMock.signOut).toHaveBeenCalled();
      expect(snackbarServiceMock.success).toHaveBeenCalledWith(
        defaultLogoutSuccessMessage,
        { variant: 'filled', autoClose: true },
        true
      );
      expect(routerMock.navigate).toHaveBeenCalledWith(['sign-in']);
      done();
    });
  });

  it('should call authLogout and show error snackbar on failure', (done) => {
    angularFireAuthMock.signOut.mockRejectedValueOnce({
      message: defaultErrorMessage
    });

    authService.authLogout().subscribe(() => {
      expect(angularFireAuthMock.signOut).toHaveBeenCalled();
      expect(snackbarServiceMock.error).toHaveBeenCalledWith(
        defaultErrorMessage,
        { variant: 'filled' },
        true
      );
      done();
    });
  });
});
