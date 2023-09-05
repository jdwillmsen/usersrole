import { ProfileComponent } from './profile.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProfileComponent', () => {
  it('should mount', () => {
    cy.mount(ProfileComponent, {
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        HttpClientModule,
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
