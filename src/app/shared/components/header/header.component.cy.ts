import { HeaderComponent } from './header.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
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

describe('HeaderComponent', () => {
  const providers = [
    { provide: ActivatedRoute, useValue: {} },
    { provide: AUTH, useValue: authMock }
  ];

  it('should mount', () => {
    cy.mount(HeaderComponent, {
      imports: [MatSnackBarModule],
      providers
    });
  });

  it('should be setup properly', () => {
    cy.mount(HeaderComponent, {
      imports: [MatSnackBarModule],
      providers
    });
    cy.getByCy('navbar-header').should('be.visible');
    cy.getByCy('app-name')
      .should('be.visible')
      .and('contain.text', 'Users Role');
    cy.getByCy('github-button-icon').should('be.visible');
  });
});
