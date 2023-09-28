import { SignUpComponent } from './sign-up.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Route } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SignInComponent } from '../sign-in/sign-in.component';

describe('SignUpComponent', () => {
  it('should mount', () => {
    cy.mount(SignUpComponent, {
      imports: [HttpClientModule, MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    });
  });

  it('should be setup properly', () => {
    cy.mount(SignUpComponent, {
      imports: [HttpClientModule, MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    });
    cy.getByCy('title').should('be.visible').and('contain.text', 'Sign Up');
    cy.getByCy('email-address-field')
      .should('be.visible')
      .and('contain.text', 'Enter your email');
    cy.getByCy('display-name-field')
      .should('be.visible')
      .and('contain.text', 'Enter your display name');
    cy.getByCy('password-field')
      .should('be.visible')
      .and('contain.text', 'Enter your password');
    cy.getByCy('passwordVisibilityButton')
      .should('be.visible')
      .and('be.enabled');
    cy.getByCy('confirm-password-field')
      .should('be.visible')
      .and('contain.text', 'Enter your confirm password');
    cy.getByCy('confirmPasswordVisibilityButton')
      .should('be.visible')
      .and('be.enabled');
    cy.getByCy('sign-up-button')
      .should('be.visible')
      .and('contain.text', 'Sign Up');
    cy.getByCy('signIn')
      .should('be.visible')
      .and('contain.text', 'Already have an account?');
    cy.getByCy('signInLink')
      .should('be.visible')
      .and('contain.text', 'Sign in');
  });

  it('should show correct error messages', () => {
    cy.mount(SignUpComponent, {
      imports: [HttpClientModule, MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    });
    cy.getByCy('sign-up-button').click();
    cy.getByCy('email-address-field')
      .should('contain.text', 'Email is required')
      .type('test')
      .should('contain.text', 'Enter a valid email');
    cy.getByCy('display-name-field').should(
      'contain.text',
      'Display name is required'
    );
    cy.getByCy('password-field')
      .should('contain.text', 'Password is required')
      .type('test')
      .should('contain.text', 'Password must be at least 6 characters long');
    cy.getByCy('confirm-password-field')
      .should('contain.text', 'Confirm password is required')
      .type('tes')
      .should('contain.text', 'Password must be at least 6 characters long');
    cy.getByCy('matchingPasswordError')
      .should('be.visible')
      .and('contain.text', 'Passwords must match');
  });

  it.only('should submit form correctly', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/api/users'
      },
      '{"uid":"test-uid-1"}'
    ).as('getUsers');
    const routes: Route[] = [
      {
        path: 'sign-in',
        component: SignInComponent
      }
    ];
    cy.mount(SignUpComponent, {
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    });
    cy.getByCy('email-address-field').type('test-user-1@usersrole.com');
    cy.getByCy('display-name-field').type('Basic Test User #1');
    cy.getByCy('password-field').type('testPassword');
    cy.getByCy('confirm-password-field').type('testPassword');
    cy.getByCy('sign-up-button').click();
    cy.getByCy('snackbar-container')
      .should('be.visible')
      .and('contain.text', 'Sign Up Successful');
  });
});
