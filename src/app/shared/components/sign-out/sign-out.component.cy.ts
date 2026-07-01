import { SignOutComponent } from './sign-out.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AUTH } from '../../../core/firebase.tokens';

describe('SignOutComponent', () => {
  const providers = [{ provide: AUTH, useValue: {} }];

  it('should mount', () => {
    cy.mount(SignOutComponent, {
      imports: [MatSnackBarModule],
      providers
    });
  });

  it('should be setup properly', () => {
    cy.mount(SignOutComponent, {
      imports: [MatSnackBarModule],
      providers
    });
    cy.getByCy('sign-out-button')
      .should('be.visible')
      .and('be.enabled')
      .and('contain.text', 'Sign Out');
  });
});
