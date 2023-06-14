import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider, User, getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  BehaviorSubject,
  Observable,
  from,
  switchMap,
  tap
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: BehaviorSubject<Observable<any> | null> =
    new BehaviorSubject<Observable<any> | null>(null);

  user$ = this.user.asObservable().pipe(switchMap((user: any) => user));

  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router
  ) {
    this.user.next(this.angularFireAuth.authState);
  }

  emailAuth(email: string, password: string): Observable<any> {
    return from(
      this.angularFireAuth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          this.setAuthenticated(true);
          this.router.navigate(['home']);
          console.log("You've been successfully logged in!");
        })
        .catch((error) => {
          this.setAuthenticated(false);
          console.log('An error has occured: ', error);
        })
    );
  }

  // Google Sign In
  googleAuth(): Observable<any> {
    return from(this.authLogin(new GoogleAuthProvider()));
  }

  authLogin(provider: GoogleAuthProvider | any): Observable<any> {
    return from(
      this.angularFireAuth
        .signInWithRedirect(provider)
        .catch((error) => {
          this.setAuthenticated(false);
          console.log('An error has occured: ', error);
        })
    );
  }

  authLogout(): Observable<void> {
    return from(
      this.angularFireAuth.signOut().then(() => {
        this.setAuthenticated(false);
        this.router.navigate(['sign-in']);
        console.log("You've been successfully logged out!");
      })
    );
  }

  initAuthListenter(): Observable<any> {
    return this.angularFireAuth.authState.pipe(
      tap(user => {
        if (user) {
          this.setAuthenticated(true);
          this.router.navigate(['home'])
        } else {
          this.setAuthenticated(false);
        }
      })
    )
  }


  private setAuthenticated(authenticated: boolean) {
    if (authenticated) {
      sessionStorage.setItem("isAuthenticated", "true");
    } else {
      sessionStorage.removeItem("isAuthenticated");
    }
  }
}
