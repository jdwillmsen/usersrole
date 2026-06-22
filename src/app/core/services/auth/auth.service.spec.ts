import { AuthService } from './auth.service';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import * as firebaseAuth from 'firebase/auth';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider
} from 'firebase/auth';
import * as rxfireAuth from 'rxfire/auth';
import * as errorHandlerModule from '../error-handler/error-handler.service';

jest.mock('firebase/auth', () => ({
  __esModule: true,
  ...jest.requireActual('firebase/auth'),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  fetchSignInMethodsForEmail: jest.fn(),
  linkWithCredential: jest.fn()
}));

describe('AuthService', () => {
  let authService: AuthService;
  const authMock = {} as firebaseAuth.Auth;
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
  const defaultErrorMessage = 'An error has occurred';
  const defaultLoginSuccessMessage = 'Sign in successful';
  const defaultLogoutSuccessMessage = 'Sign out successful';
  const invalidSignInMessage = 'Invalid email or password';

  const signInWithEmailAndPasswordSpy =
    firebaseAuth.signInWithEmailAndPassword as jest.Mock;
  const signInWithPopupSpy = firebaseAuth.signInWithPopup as jest.Mock;
  const signOutSpy = firebaseAuth.signOut as jest.Mock;
  const fetchSignInMethodsForEmailSpy =
    firebaseAuth.fetchSignInMethodsForEmail as jest.Mock;
  const linkWithCredentialSpy = firebaseAuth.linkWithCredential as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(rxfireAuth, 'authState').mockReturnValue(of(null) as any);
    linkWithCredentialSpy.mockResolvedValue({} as any);

    authService = new AuthService(authMock, routerMock, snackbarServiceMock);
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
    signInWithEmailAndPasswordSpy.mockResolvedValueOnce({} as any);

    authService.emailAuth(defaultEmail, defaultPassword).subscribe(() => {
      expect(signInWithEmailAndPasswordSpy).toHaveBeenCalledWith(
        authMock,
        defaultEmail,
        defaultPassword
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

  it('should call emailAuth and show error snackbar on failure', (done) => {
    signInWithEmailAndPasswordSpy.mockRejectedValueOnce({
      message: defaultErrorMessage
    });

    authService.emailAuth(defaultEmail, defaultPassword).subscribe(() => {
      expect(signInWithEmailAndPasswordSpy).toHaveBeenCalledWith(
        authMock,
        defaultEmail,
        defaultPassword
      );
      expect(snackbarServiceMock.error).toHaveBeenCalledWith(
        defaultErrorMessage,
        { variant: 'filled' },
        true
      );
      done();
    });
  });

  it('should call emailAuth and show error message with incorrect email', (done) => {
    signInWithEmailAndPasswordSpy.mockRejectedValueOnce({
      code: 'auth/user-not-found'
    });

    authService.emailAuth(defaultEmail, defaultPassword).subscribe(() => {
      expect(snackbarServiceMock.error).toHaveBeenCalledWith(
        invalidSignInMessage,
        { variant: 'filled' },
        true
      );
      done();
    });
  });

  it('should call emailAuth and show error message with incorrect password', (done) => {
    signInWithEmailAndPasswordSpy.mockRejectedValueOnce({
      code: 'auth/wrong-password'
    });

    authService.emailAuth(defaultEmail, defaultPassword).subscribe(() => {
      expect(snackbarServiceMock.error).toHaveBeenCalledWith(
        invalidSignInMessage,
        { variant: 'filled' },
        true
      );
      done();
    });
  });

  it('should call googleAuth and navigate to home on success', (done) => {
    signInWithPopupSpy.mockResolvedValueOnce({} as any);

    authService.googleAuth().subscribe(() => {
      expect(signInWithPopupSpy).toHaveBeenCalledWith(
        authMock,
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
    signInWithPopupSpy.mockRejectedValueOnce({ message: defaultErrorMessage });

    authService.googleAuth().subscribe(() => {
      expect(signInWithPopupSpy).toHaveBeenCalledWith(
        authMock,
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

  it('should call githubAuth and navigate to home on success', (done) => {
    signInWithPopupSpy.mockResolvedValueOnce({} as any);

    authService.githubAuth().subscribe(() => {
      expect(signInWithPopupSpy).toHaveBeenCalledWith(
        authMock,
        expect.any(GithubAuthProvider)
      );
      expect(routerMock.navigate).toHaveBeenCalledWith(['home']);
      done();
    });
  });

  it('should call githubAuth and show error snackbar on failure', (done) => {
    signInWithPopupSpy.mockRejectedValueOnce({ message: defaultErrorMessage });

    authService.githubAuth().subscribe(() => {
      expect(signInWithPopupSpy).toHaveBeenCalledWith(
        authMock,
        expect.any(GithubAuthProvider)
      );
      expect(snackbarServiceMock.error).toHaveBeenCalledWith(
        defaultErrorMessage,
        { variant: 'filled' },
        true
      );
      done();
    });
  });

  it('should call twitterAuth and navigate to home on success', (done) => {
    signInWithPopupSpy.mockResolvedValueOnce({} as any);

    authService.twitterAuth().subscribe(() => {
      expect(signInWithPopupSpy).toHaveBeenCalledWith(
        authMock,
        expect.any(TwitterAuthProvider)
      );
      expect(routerMock.navigate).toHaveBeenCalledWith(['home']);
      done();
    });
  });

  it('should call twitterAuth and show error snackbar on failure', (done) => {
    signInWithPopupSpy.mockRejectedValueOnce({ message: defaultErrorMessage });

    authService.twitterAuth().subscribe(() => {
      expect(signInWithPopupSpy).toHaveBeenCalledWith(
        authMock,
        expect.any(TwitterAuthProvider)
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
    signInWithPopupSpy.mockResolvedValueOnce({} as any);

    authService.authLogin(authProviderMock).subscribe(() => {
      expect(signInWithPopupSpy).toHaveBeenCalledWith(authMock, authProviderMock);
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
    signInWithPopupSpy.mockRejectedValueOnce({ message: defaultErrorMessage });

    authService.authLogin(authProviderMock).subscribe(() => {
      expect(signInWithPopupSpy).toHaveBeenCalledWith(authMock, authProviderMock);
      expect(snackbarServiceMock.error).toHaveBeenCalledWith(
        defaultErrorMessage,
        { variant: 'filled' },
        true
      );
      done();
    });
  });

  it('should call authLogout and navigate to sign-in on success', (done) => {
    signOutSpy.mockResolvedValueOnce(undefined);

    authService.authLogout().subscribe(() => {
      expect(signOutSpy).toHaveBeenCalledWith(authMock);
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
    signOutSpy.mockRejectedValueOnce({ message: defaultErrorMessage });

    authService.authLogout().subscribe(() => {
      expect(signOutSpy).toHaveBeenCalledWith(authMock);
      expect(snackbarServiceMock.error).toHaveBeenCalledWith(
        defaultErrorMessage,
        { variant: 'filled' },
        true
      );
      done();
    });
  });

  it('should return a GoogleAuthProvider instance when passed GoogleAuthProvider.PROVIDER_ID', () => {
    const result = authService.getProvider(GoogleAuthProvider.PROVIDER_ID);
    expect(result).toBeInstanceOf(GoogleAuthProvider);
  });

  it('should return a GithubAuthProvider instance when passed GithubAuthProvider.PROVIDER_ID', () => {
    const result = authService.getProvider(GithubAuthProvider.PROVIDER_ID);
    expect(result).toBeInstanceOf(GithubAuthProvider);
  });

  it('should return a TwitterAuthProvider instance when passed TwitterAuthProvider.PROVIDER_ID', () => {
    const result = authService.getProvider(TwitterAuthProvider.PROVIDER_ID);
    expect(result).toBeInstanceOf(TwitterAuthProvider);
  });

  it('should throw an error when passed an unknown providerId', () => {
    const unknownProviderId = 'unknown_provider';
    expect(() => {
      authService.getProvider(unknownProviderId);
    }).toThrow(`No provider implemented for ${unknownProviderId}`);
  });

  it('should handle login failure when error code account exists with different credentials', async () => {
    const error = {
      email: 'test-user@usersrole.com',
      credential: true,
      code: 'auth/account-exists-with-different-credential'
    };
    const handleErrorSpy = jest.spyOn(errorHandlerModule, 'handleError');
    fetchSignInMethodsForEmailSpy.mockResolvedValue([
      GoogleAuthProvider.PROVIDER_ID
    ]);
    signInWithPopupSpy.mockResolvedValue({ user: {} } as any);

    await authService.handleAuthLoginFailure(error);

    expect(fetchSignInMethodsForEmailSpy).toHaveBeenCalledWith(
      authMock,
      error.email
    );
    expect(handleErrorSpy).not.toHaveBeenCalled();
  });

  it('should handle error when unknown conditions', () => {
    const error = {};
    const handleErrorSpy = jest.spyOn(errorHandlerModule, 'handleError');

    authService.handleAuthLoginFailure(error);

    expect(fetchSignInMethodsForEmailSpy).not.toHaveBeenCalled();
    expect(handleErrorSpy).toHaveBeenCalled();
  });

  it('should handle error when linking credentials fails', async () => {
    const error = {
      email: 'test-user@usersrole.com',
      credential: true,
      code: 'auth/account-exists-with-different-credential'
    };
    const handleErrorSpy = jest.spyOn(errorHandlerModule, 'handleError');
    fetchSignInMethodsForEmailSpy.mockResolvedValue([
      GoogleAuthProvider.PROVIDER_ID,
      GithubAuthProvider.PROVIDER_ID
    ]);
    signInWithPopupSpy.mockResolvedValue({ user: {} } as any);
    linkWithCredentialSpy.mockImplementation(() => {
      throw new Error('Signal credentials error');
    });

    await authService.handleAuthLoginFailure(error);

    expect(fetchSignInMethodsForEmailSpy).toHaveBeenCalledWith(
      authMock,
      error.email
    );
    expect(handleErrorSpy).toHaveBeenCalled();
  });

  it('should handle error when sign in with popup fails', async () => {
    const error = {
      email: 'test-user@usersrole.com',
      credential: true,
      code: 'auth/account-exists-with-different-credential'
    };
    const handleErrorSpy = jest.spyOn(errorHandlerModule, 'handleError');
    fetchSignInMethodsForEmailSpy.mockResolvedValue([
      GoogleAuthProvider.PROVIDER_ID,
      TwitterAuthProvider.PROVIDER_ID
    ]);
    signInWithPopupSpy.mockRejectedValue(new Error('Sign in with popup failed'));

    await authService.handleAuthLoginFailure(error);

    expect(fetchSignInMethodsForEmailSpy).toHaveBeenCalledWith(
      authMock,
      error.email
    );
    expect(handleErrorSpy).toHaveBeenCalled();
  });

  it('should handle error when fetch sign in methods for email fails', async () => {
    const error = {
      email: 'test-user@usersrole.com',
      credential: true,
      code: 'auth/account-exists-with-different-credential'
    };
    const handleErrorSpy = jest.spyOn(errorHandlerModule, 'handleError');
    fetchSignInMethodsForEmailSpy.mockRejectedValue(new Error('Fetched failed'));

    await authService.handleAuthLoginFailure(error);

    expect(fetchSignInMethodsForEmailSpy).toHaveBeenCalledWith(
      authMock,
      error.email
    );
    expect(handleErrorSpy).toHaveBeenCalled();
  });

  it('should handle error when first popup provider method is not supported', async () => {
    const error = {
      email: 'test-user@usersrole.com',
      credential: true,
      code: 'auth/account-exists-with-different-credential'
    };
    const handleErrorSpy = jest.spyOn(errorHandlerModule, 'handleError');
    fetchSignInMethodsForEmailSpy.mockResolvedValue(['unknown-provider.test']);

    await authService.handleAuthLoginFailure(error);

    expect(fetchSignInMethodsForEmailSpy).toHaveBeenCalledWith(
      authMock,
      error.email
    );
    expect(handleErrorSpy).toHaveBeenCalled();
  });
});
