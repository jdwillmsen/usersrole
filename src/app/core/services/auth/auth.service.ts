import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { BehaviorSubject, from, Observable, of, switchMap } from 'rxjs';
import { SnackbarService } from '../snackbar/snackbar.service';
import firebase from 'firebase/compat/app';
import {
  ACCOUNT_PROVIDER_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
  INVALID_SIGN_IN_MESSAGE,
  SUCCESS_SIGN_IN_MESSAGE,
  SUCCESS_SIGN_OUT_MESSAGE
} from '../../constants/message.constants';
import {
  ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL,
  USER_NOT_FOUND,
  WRONG_PASSWORD
} from '../../constants/google.constants';
import { handleError } from '../error-handler/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: BehaviorSubject<Observable<firebase.User | null>> =
    new BehaviorSubject<Observable<firebase.User | null>>(of(null));
  user$ = this.user.asObservable().pipe(switchMap((user) => user));
  private supportedPopupSignInMethods: string[] = [
    GoogleAuthProvider.PROVIDER_ID,
    GithubAuthProvider.PROVIDER_ID
  ];

  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private snackbarService: SnackbarService
  ) {
    this.user.next(this.angularFireAuth.authState);
  }

  emailAuth(email: string, password: string): Observable<void> {
    return from(
      this.angularFireAuth
        .signInWithEmailAndPassword(email, password)
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
          if (error.code === USER_NOT_FOUND || error.code === WRONG_PASSWORD) {
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

  authLogin(
    provider: GoogleAuthProvider | GithubAuthProvider
  ): Observable<void> {
    return from(
      this.angularFireAuth
        .signInWithPopup(provider)
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
      this.angularFireAuth
        .signOut()
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
      default:
        throw new Error(`No provider implemented for ${providerId}`);
    }
  }

  private handleAuthLoginFailure(error: any) {
    if (
      error.email &&
      error.credential &&
      error.code === ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL
    ) {
      this.angularFireAuth
        .fetchSignInMethodsForEmail(error.email)
        .then((providers) => {
          const firstPopupProviderMethod = providers.find((p) =>
            this.supportedPopupSignInMethods.includes(p)
          );
          if (!firstPopupProviderMethod) {
            throw new Error(ACCOUNT_PROVIDER_ERROR_MESSAGE);
          }
          const linkedProvider = this.getProvider(firstPopupProviderMethod);
          linkedProvider.setCustomParameters({ login_hint: error.email });
          this.angularFireAuth
            .signInWithPopup(linkedProvider)
            .then((result) => {
              if (result.user) result.user.linkWithCredential(error.credential);
            })
            .catch((error) => handleError(error, this.snackbarService));
        })
        .catch((error) => handleError(error, this.snackbarService));
    }
    handleError(error, this.snackbarService);
  }
}
