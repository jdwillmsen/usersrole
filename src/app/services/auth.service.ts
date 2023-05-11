import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private angularFireAuth: AngularFireAuth) {}

  // Google Sign In
  googleAuth() {
    return this.authLogin(new GoogleAuthProvider());
  }

  authLogin(provider: GoogleAuthProvider | any) {
    return this.angularFireAuth.signInWithPopup(provider).then((result) => {
      console.log("You've been successfully logged in!");
    }).catch((error) => {
      console.log('An error has occured: ', error);
    })
  }
}
