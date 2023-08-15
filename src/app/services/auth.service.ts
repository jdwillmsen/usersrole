import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';
import { BehaviorSubject, Observable, from, of, switchMap } from 'rxjs';
import { SnackbarService } from './snackbar.service';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: BehaviorSubject<Observable<firebase.User | null>> =
    new BehaviorSubject<Observable<firebase.User | null>>(of(null));

  user$ = this.user.asObservable().pipe(switchMap((user) => user));

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
            'Login Successful',
            {
              variant: 'filled',
              autoClose: true
            },
            true
          );
          this.router.navigate(['home']);
        })
        .catch((error) => {
          this.snackbarService.error(
            error.message,
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

  authLogin(provider: GoogleAuthProvider): Observable<void> {
    return from(
      this.angularFireAuth
        .signInWithPopup(provider)
        .then(() => {
          this.snackbarService.success(
            'Login Successful',
            {
              variant: 'filled',
              autoClose: true
            },
            true
          );
          this.router.navigate(['home']);
        })
        .catch((error) => {
          this.snackbarService.error(
            error.message,
            {
              variant: 'filled'
            },
            true
          );
        })
    );
  }

  authLogout(): Observable<void> {
    return from(
      this.angularFireAuth.signOut().then(() => {
        this.snackbarService.success(
          'Logout Successful',
          {
            variant: 'filled',
            autoClose: true
          },
          true
        );
        this.router.navigate(['sign-in']);
      })
    );
  }
}
