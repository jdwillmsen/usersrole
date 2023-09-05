import { SignInComponent } from './sign-in.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SignInComponent', () => {
  it('should mount', () => {
    cy.mount(SignInComponent, {
      imports: [MatSnackBarModule, HttpClientModule, BrowserAnimationsModule],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: {}
        },
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    });
  });
});
