import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  AuthProvider,
  fetchSignInMethodsForEmail,
  GithubAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
  User
} from 'firebase/auth';
import { authState } from 'rxfire/auth';
import { BehaviorSubject, from, Observable, of, switchMap } from 'rxjs';
import { SnackbarService } from '../snackbar/snackbar.service';
import { AUTH } from '../../firebase.tokens';
import {
  ACCOUNT_PROVIDER_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
  INVALID_SIGN_IN_MESSAGE,
  SUCCESS_SIGN_IN_MESSAGE,
  SUCCESS_SIGN_OUT_MESSAGE
} from '../../constants/message.constants';
import {
  ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL,
  INVALID_CREDENTIAL,
  USER_NOT_FOUND,
  WRONG_PASSWORD
} from '../../constants/google.constants';
import { handleError } from '../error-handler/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: BehaviorSubject<Observable<User | null>> = new BehaviorSubject<
    Observable<User | null>
  >(of(null));
  user$ = this.user.asObservable().pipe(switchMap((user) => user));
  private supportedPopupSignInMethods: string[] = [
    GoogleAuthProvider.PROVIDER_ID,
    GithubAuthProvider.PROVIDER_ID,
    TwitterAuthProvider.PROVIDER_ID
  ];

  constructor(
    @Inject(AUTH) private auth: Auth,
    private router: Router,
    private snackbarService: SnackbarService
  ) {
    this.user.next(authState(this.auth));
  }

  emailAuth(email: string, password: string): Observable<void> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password)
        .then(() => {
          this.snackbarService.success(
            SUCCESS_SIGN_IN_MESSAGE,
            {
              variant: 'filled',
              autoClose: true
            },
            true
          );
          this.router.navigate(['home']);
        })
        .catch((error) => {
          let errorMessage = DEFAULT_ERROR_MESSAGE;
          if (
            error.code === USER_NOT_FOUND ||
            error.code === WRONG_PASSWORD ||
            error.code === INVALID_CREDENTIAL
          ) {
            errorMessage = INVALID_SIGN_IN_MESSAGE;
          }
          return this.snackbarService.error(
            errorMessage,
            {
              variant: 'filled'
            },
            true
          );
        })
    );
  }

  googleAuth(): Observable<void> {
    return from(this.authLogin(new GoogleAuthProvider()));
  }

  githubAuth(): Observable<void> {
    return from(this.authLogin(new GithubAuthProvider()));
  }

  twitterAuth(): Observable<void> {
    return from(this.authLogin(new TwitterAuthProvider()));
  }

  authLogin(provider: AuthProvider): Observable<void> {
    return from(
      signInWithPopup(this.auth, provider)
        .then(() => {
          this.snackbarService.success(
            SUCCESS_SIGN_IN_MESSAGE,
            {
              variant: 'filled',
              autoClose: true
            },
            true
          );
          this.router.navigate(['home']);
        })
        .catch((error) => {
          this.handleAuthLoginFailure(error);
        })
    );
  }

  authLogout(): Observable<void> {
    return from(
      signOut(this.auth)
        .then(() => {
          this.snackbarService.success(
            SUCCESS_SIGN_OUT_MESSAGE,
            {
              variant: 'filled',
              autoClose: true
            },
            true
          );
          this.router.navigate(['sign-in']);
        })
        .catch((error) => {
          handleError(error, this.snackbarService);
        })
    );
  }

  getProvider(providerId: string) {
    switch (providerId) {
      case GoogleAuthProvider.PROVIDER_ID:
        return new GoogleAuthProvider();
      case GithubAuthProvider.PROVIDER_ID:
        return new GithubAuthProvider();
      case TwitterAuthProvider.PROVIDER_ID:
        return new TwitterAuthProvider();
      default:
        throw new Error(`No provider implemented for ${providerId}`);
    }
  }

  handleAuthLoginFailure(error: any) {
    if (
      error.email &&
      error.credential &&
      error.code === ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL
    ) {
      fetchSignInMethodsForEmail(this.auth, error.email)
        .then((providers) => {
          const firstPopupProviderMethod = providers.find((p) =>
            this.supportedPopupSignInMethods.includes(p)
          );
          if (!firstPopupProviderMethod) {
            throw new Error(ACCOUNT_PROVIDER_ERROR_MESSAGE);
          }
          const linkedProvider = this.getProvider(firstPopupProviderMethod);
          linkedProvider.setCustomParameters({ login_hint: error.email });
          signInWithPopup(this.auth, linkedProvider)
            .then((result) => {
              if (result.user)
                linkWithCredential(result.user, error.credential);
            })
            .catch((error) => handleError(error, this.snackbarService));
        })
        .catch((error) => handleError(error, this.snackbarService));
    } else {
      handleError(error, this.snackbarService);
    }
  }
}
