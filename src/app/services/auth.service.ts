import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private angularFireAuth: AngularFireAuth, private router: Router) {}

  // Google Sign In
  googleAuth() {
    return this.authLogin(new GoogleAuthProvider());
  }

  authLogin(provider: GoogleAuthProvider | any) {
    return this.angularFireAuth.signInWithPopup(provider).then((result) => {
      this.router.navigate(['home']);
      console.log("You've been successfully logged in!");
    }).catch((error) => {
      console.log('An error has occured: ', error);
    })
  }

  authLogout() {
    return this.angularFireAuth.signOut().then(() => {
      this.router.navigate(['sign-in']);
      console.log("You've been successfully logged out!");
    });
  }
}
