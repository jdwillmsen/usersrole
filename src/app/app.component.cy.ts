import { AppComponent } from './app.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AUTH, FIRESTORE } from './core/firebase.tokens';

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

describe('AppComponent', () => {
  beforeEach(() => {
    cy.mount(AppComponent, {
      imports: [MatSnackBarModule, HttpClientModule, AppRoutingModule],
      providers: [
        { provide: AUTH, useValue: authMock },
        { provide: FIRESTORE, useValue: {} }
      ]
    });
  });

  it('should mount', () => {
    console.log('Component mounted successfully');
  });

  it('should be setup properly', () => {
    cy.getByCy('header').should('be.visible');
    cy.getByCy('main').should('be.visible');
  });
});
