import { CreateThemeComponent } from './create-theme.component';
import { Firestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateThemeComponent', () => {
  it('should mount', () => {
    cy.mount(CreateThemeComponent, {
      imports: [MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        {
          provide: Firestore,
          useValue: {}
        },
        {
          provide: AngularFireAuth,
          useValue: {}
        }
      ]
    });
  });
});
