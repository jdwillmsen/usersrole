import { ThemeSelectorComponent } from './theme-selector.component';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../../../../environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ThemeSelectorComponent', () => {
  it('should mount', () => {
    cy.mount(ThemeSelectorComponent, {
      imports: [
        provideFirestore(() => getFirestore()),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: {}
        }
      ]
    });
  });
});
