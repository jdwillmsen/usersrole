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
    cy.getByCy('email-sign-in').should('be.visible');
    cy.getByCy('google-sign-in-button')
      .should('be.visible')
      .and('contain.text', 'Sign in with Google');
    cy.getByCy('github-sign-in-button')
      .should('be.visible')
      .and('contain.text', 'Sign in with GitHub');
    cy.getByCy('twitter-sign-in-button')
      .should('be.visible')
      .and('contain.text', 'Sign in with Twitter');
    cy.getByCy('new-user')
      .should('be.visible')
      .and('contain.text', 'New User?');
    cy.getByCy('sign-up-link')
      .should('be.visible')
      .and('contain.text', 'Sign up');
  });
});
