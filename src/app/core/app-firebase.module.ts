import { NgModule } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
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

// environment.ts is generated from a secret that predates this flag, so it is
// read defensively rather than added to every environment's type.
const useEmulators =
  'useEmulators' in environment && environment.useEmulators === true;

// Must match the ports in firebase.json.
const EMULATOR_HOST = '127.0.0.1';
const EMULATOR_PORTS = {
  auth: 9099,
  firestore: 8080,
  functions: 5001,
  storage: 9199
};

const firebaseApp = initializeApp(environment.firebase);

// The emulators do not enforce App Check, and reCAPTCHA cannot issue a token
// without a real site key, so initializing it locally only produces errors.
if (!useEmulators) {
  initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaV3Provider(environment.recaptcha.siteKey),
    isTokenAutoRefreshEnabled: true
  });
}

@NgModule({
  providers: [
    { provide: FIREBASE_APP, useValue: firebaseApp },
    {
      provide: AUTH,
      useFactory: () => {
        const auth = getAuth(firebaseApp);
        if (useEmulators) {
          connectAuthEmulator(
            auth,
            `http://${EMULATOR_HOST}:${EMULATOR_PORTS.auth}`
          );
        }
        return auth;
      }
    },
    {
      provide: FIRESTORE,
      useFactory: () => {
        const firestore = getFirestore(firebaseApp);
        if (useEmulators) {
          connectFirestoreEmulator(
            firestore,
            EMULATOR_HOST,
            EMULATOR_PORTS.firestore
          );
        }
        return firestore;
      }
    },
    {
      provide: FUNCTIONS,
      useFactory: () => {
        const functions = getFunctions(firebaseApp);
        if (useEmulators) {
          connectFunctionsEmulator(
            functions,
            EMULATOR_HOST,
            EMULATOR_PORTS.functions
          );
        }
        return functions;
      }
    },
    {
      provide: STORAGE,
      useFactory: () => {
        const storage = getStorage(firebaseApp);
        if (useEmulators) {
          connectStorageEmulator(
            storage,
            EMULATOR_HOST,
            EMULATOR_PORTS.storage
          );
        }
        return storage;
      }
    },
    { provide: ANALYTICS, useFactory: () => getAnalytics(firebaseApp) }
  ]
})
export class AppFirebaseModule {}
