import { NgModule } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { environment } from '../../environments/environment';
import {
  ANALYTICS,
  AUTH,
  FIREBASE_APP,
  FIRESTORE,
  FUNCTIONS,
  STORAGE
} from './firebase.tokens';

const firebaseApp = initializeApp(environment.firebase);

initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaV3Provider(environment.recaptcha.siteKey),
  isTokenAutoRefreshEnabled: true
});

@NgModule({
  providers: [
    { provide: FIREBASE_APP, useValue: firebaseApp },
    { provide: AUTH, useFactory: () => getAuth(firebaseApp) },
    { provide: FIRESTORE, useFactory: () => getFirestore(firebaseApp) },
    { provide: FUNCTIONS, useFactory: () => getFunctions(firebaseApp) },
    { provide: STORAGE, useFactory: () => getStorage(firebaseApp) },
    { provide: ANALYTICS, useFactory: () => getAnalytics(firebaseApp) }
  ]
})
export class AppFirebaseModule {}
