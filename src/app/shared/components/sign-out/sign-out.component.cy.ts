import { SignOutComponent } from './sign-out.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../../environments/environment';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('SignOutComponent', () => {
  it('should mount', () => {
    cy.mount(SignOutComponent, {
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule
      ]
    });
  });

  it('should be setup properly', () => {
    cy.mount(SignOutComponent, {
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule
      ]
    });
    cy.getByCy('sign-out-button')
      .should('be.visible')
      .and('be.enabled')
      .and('contain.text', 'Sign Out');
  });
});
