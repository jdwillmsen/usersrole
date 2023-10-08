import { ProfileCardComponent } from './profile-card.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../../environments/environment';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Route } from '@angular/router';
import { SignInComponent } from '../../../authentication/components/sign-in/sign-in.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfileCardComponent', () => {
  it('should mount', () => {
    cy.mount(ProfileCardComponent, {
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      componentProperties: {
        user: undefined
      }
    });
  });

  it('should be setup properly', () => {
    cy.mount(ProfileCardComponent, {
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      componentProperties: {
        user: undefined
      }
    });
    cy.getByCy('profile-card-button').should('be.visible').click();
    cy.getByCy('user-button-icon').should('be.visible');
    cy.getByCy('user-icon').should('be.visible');
    cy.getByCy('display-name').should('not.have.value');
    cy.getByCy('email').should('not.have.value');
    cy.getByCy('sign-out').should('be.visible');
    cy.get('.cdk-overlay-backdrop').click({ force: true });
  });

  it('should be able to sign out', () => {
    const routes: Route[] = [
      {
        path: 'sign-in',
        component: SignInComponent
      }
    ];
    cy.mount(ProfileCardComponent, {
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(routes)
      ],
      componentProperties: {
        user: undefined
      }
    });
    cy.getByCy('profile-card-button').click();
    cy.getByCy('sign-out').click();
    cy.getByCy('snackbar-container')
      .should('be.visible')
      .and('contain.text', 'Sign out successful');
  });
});
