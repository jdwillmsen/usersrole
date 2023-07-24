import { Injectable } from '@angular/core';
import { Firestore, getDoc, doc, setDoc } from '@angular/fire/firestore';

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

  setUsersDoc(uid: string, themeName: string) {
    const docRef = doc(this.firestore, 'users', uid);
    return setDoc(docRef, { theme: themeName }, { merge: true})
  }
}
