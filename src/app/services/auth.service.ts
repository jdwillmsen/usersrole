import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';
import { BehaviorSubject, Observable, from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: BehaviorSubject<Observable<unknown> | null> =
    new BehaviorSubject<Observable<unknown> | null>(null);

  user$ = this.user.asObservable().pipe(switchMap((user: any) => user));

  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router
  ) {
    this.user.next(this.angularFireAuth.authState);
  }

  emailAuth(email: string, password: string): Observable<unknown> {
    return from(
      this.angularFireAuth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          this.router.navigate(['home']);
          console.log("You've been successfully logged in!");
        })
        .catch((error) => {
          console.log('An error has occured: ', error);
        })
    );
  }

  // Google Sign In
  googleAuth(): Observable<unknown> {
    return from(this.authLogin(new GoogleAuthProvider()));
  }

  authLogin(provider: GoogleAuthProvider | never): Observable<unknown> {
    return from(
      this.angularFireAuth.signInWithRedirect(provider).catch((error) => {
        console.log('An error has occured: ', error);
      })
    );
  }

  authLogout(): Observable<void> {
    return from(
      this.angularFireAuth.signOut().then(() => {
        this.router.navigate(['sign-in']);
        console.log("You've been successfully logged out!");
      })
    );
  }
}
