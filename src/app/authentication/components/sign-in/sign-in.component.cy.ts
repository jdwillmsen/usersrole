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

  it('should be setup properly', () => {
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
    cy.getByCy('title').should('be.visible').and('contain.text', 'Sign In');
    cy.getByCy('emailSignIn').should('be.visible');
    cy.getByCy('googleSignInButton')
      .should('be.visible')
      .and('contain.text', 'Sign in with Google');
    cy.getByCy('newUser').should('be.visible').and('contain.text', 'New User?');
    cy.getByCy('signUpLink')
      .should('be.visible')
      .and('contain.text', 'Sign up');
  });
});
