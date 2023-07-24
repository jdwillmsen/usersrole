import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { NgModule } from '@angular/core';

import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    AngularFireAuthModule,
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase)
  ],
  exports: [AngularFireModule, AngularFireAuthModule]
})
export class AppFirebaseModule {}
