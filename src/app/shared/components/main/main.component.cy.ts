import { MainComponent } from './main.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { AUTH, FIRESTORE } from '../../../core/firebase.tokens';

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

describe('MainComponent', () => {
  const providers = [
    { provide: AUTH, useValue: authMock },
    { provide: FIRESTORE, useValue: {} }
  ];

  it('should mount', () => {
    cy.mount(MainComponent, {
      imports: [MatSnackBarModule, HttpClientModule],
      providers
    });
  });

  it('should be setup properly', () => {
    cy.mount(MainComponent, {
      imports: [MatSnackBarModule, HttpClientModule],
      providers
    });
    cy.getByCy('sidenav-content').should('be.visible');
  });
});
