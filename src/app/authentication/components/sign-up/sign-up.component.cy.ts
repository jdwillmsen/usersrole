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
    cy.getByCy('emailAddressField')
      .should('be.visible')
      .and('contain.text', 'Enter your email');
    cy.getByCy('displayNameField')
      .should('be.visible')
      .and('contain.text', 'Enter your display name');
    cy.getByCy('passwordField')
      .should('be.visible')
      .and('contain.text', 'Enter your password');
    cy.getByCy('passwordVisibilityButton')
      .should('be.visible')
      .and('be.enabled');
    cy.getByCy('confirmPasswordField')
      .should('be.visible')
      .and('contain.text', 'Enter your confirm password');
    cy.getByCy('confirmPasswordVisibilityButton')
      .should('be.visible')
      .and('be.enabled');
    cy.getByCy('signUpButton')
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
    cy.getByCy('signUpButton').click();
    cy.getByCy('emailAddressField')
      .should('contain.text', 'Email is required')
      .type('test')
      .should('contain.text', 'Enter a valid email');
    cy.getByCy('displayNameField').should(
      'contain.text',
      'Display name is required'
    );
    cy.getByCy('passwordField')
      .should('contain.text', 'Password is required')
      .type('test')
      .should('contain.text', 'Password must be at least 6 characters long');
    cy.getByCy('confirmPasswordField')
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
    cy.getByCy('emailAddressField').type('test-user-1@usersrole.com');
    cy.getByCy('displayNameField').type('Basic Test User #1');
    cy.getByCy('passwordField').type('testPassword');
    cy.getByCy('confirmPasswordField').type('testPassword');
    cy.getByCy('signUpButton').click();
    cy.getByCy('snackbarContainer')
      .should('be.visible')
      .and('contain.text', 'Sign Up Successful');
  });
});
