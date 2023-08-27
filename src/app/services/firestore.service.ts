import { Injectable } from '@angular/core';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Theme } from '../models/theme.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  firestore: Firestore;

  constructor(firestore: Firestore) {
    this.firestore = firestore;
  }

  async getUsersDoc(uid: string) {
    const docRef = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  }

  setThemeName(uid: string, themeName: string) {
    const docRef = doc(this.firestore, 'users', uid);
    return setDoc(docRef, { theme: themeName }, { merge: true });
  }

  setCustomLightTheme(uid: string, theme: Theme) {
    const docRef = doc(this.firestore, 'users', uid);
    return setDoc(docRef, { lightTheme: theme }, { merge: true });
  }

  setCustomDarkTheme(uid: string, theme: Theme) {
    const docRef = doc(this.firestore, 'users', uid);
    return setDoc(docRef, { darkTheme: theme }, { merge: true });
  }
}
