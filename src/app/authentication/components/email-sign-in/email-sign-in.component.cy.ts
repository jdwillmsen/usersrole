import { EmailSignInComponent } from './email-sign-in.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Route } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from '../../../home/components/home/home.component';

describe('EmailSignInComponent', () => {
  it('should mount', () => {
    cy.mount(EmailSignInComponent, {
      imports: [MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: {}
        }
      ]
    });
  });

  it('should be setup properly', () => {
    cy.mount(EmailSignInComponent, {
      imports: [MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: {}
        }
      ]
    });
    cy.getByCy('email-address-field')
      .should('be.visible')
      .and('contain.text', 'Enter your email');
    cy.getByCy('password-field')
      .should('be.visible')
      .and('contain.text', 'Enter your password');
    cy.getByCy('password-visibility-button')
      .should('be.visible')
      .and('be.enabled')
      .click();
    cy.getByCy('sign-in-button')
      .should('be.visible')
      .and('contain.text', 'Sign In')
      .and('be.enabled');
  });

  it('should show error fields for improper input', () => {
    cy.mount(EmailSignInComponent, {
      imports: [MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: {}
        }
      ]
    });
    cy.getByCy('email-address-field').find('input').click().blur();
    cy.getByCy('email-address-field')
      .should('contain.text', 'Email is required')
      .type('test')
      .should('contain.text', 'Enter a valid email');
    cy.getByCy('password-field').find('input').click().blur();
    cy.getByCy('password-field')
      .should('contain.text', 'Password is required')
      .type('test')
      .should('contain.text', 'Password must be at least 6 characters long');
  });

  it('should submit form successfully with correct input', () => {
    const routes: Route[] = [
      {
        path: 'home',
        component: HomeComponent
      }
    ];
    cy.mount(EmailSignInComponent, {
      imports: [
        MatSnackBarModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: {
            signInWithEmailAndPassword: () => {
              return new Promise((resolve) => resolve('success'));
            }
          }
        }
      ]
    });
    cy.getByCy('email-address-field').type('test-user-1@usersrole.com');
    cy.getByCy('password-field').type('testPassword');
    cy.getByCy('sign-in-button').click();
    cy.getByCy('snackbar-container')
      .should('be.visible')
      .and('contain.text', 'Sign in successful');
  });
});
