import { ProfileComponent } from './profile.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AUTH } from '../../../core/firebase.tokens';

const authMock = {
  onAuthStateChanged: (next: (u: unknown) => void) => {
    next(null);
    return () => undefined;
  },
  onIdTokenChanged: (next: (u: unknown) => void) => {
    next(null);
    return () => undefined;
  },
  currentUser: null
};

describe('ProfileComponent', () => {
  it('should mount', () => {
    cy.mount(ProfileComponent, {
      imports: [HttpClientModule, MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        {
          provide: AUTH,
          useValue: authMock
        }
      ]
    });
  });

  it('should be setup properly', () => {
    cy.mount(ProfileComponent, {
      imports: [HttpClientModule, MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        {
          provide: AUTH,
          useValue: authMock
        }
      ]
    });
    cy.getByCy('title').should('be.visible').and('contain.text', 'Profile');
    cy.getByCy('email-address-field')
      .should('be.visible')
      .and('contain.text', 'Email Address');
    cy.getByCy('display-name-field')
      .should('be.visible')
      .and('contain.text', 'Display Name');
    cy.getByCy('roles-field').should('be.visible').and('contain.text', 'Roles');
  });
});
