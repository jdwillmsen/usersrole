import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService
} from '@angular/fire/analytics';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { NgModule } from '@angular/core';

import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    provideAnalytics(() => getAnalytics()),
    provideStorage(() => getStorage()),
    provideFunctions(() => getFunctions()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() => initializeApp(environment.firebase))
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
  ]
})
export class AppFirebaseModule {}
