import { ProfileCardComponent } from './profile-card.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Route, Router } from '@angular/router';
import { SignInComponent } from '../../../authentication/components/sign-in/sign-in.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AUTH } from '../../../core/firebase.tokens';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SnackbarService } from '../../../core/services/snackbar/snackbar.service';
import { SUCCESS_SIGN_OUT_MESSAGE } from '../../../core/constants/message.constants';

describe('ProfileCardComponent', () => {
  it('should mount', () => {
    cy.mount(ProfileCardComponent, {
      imports: [MatSnackBarModule, BrowserAnimationsModule],
      providers: [{ provide: AUTH, useValue: {} }],
      componentProperties: {
        user: undefined
      }
    });
  });

  it('should be setup properly', () => {
    cy.mount(ProfileCardComponent, {
      imports: [MatSnackBarModule, BrowserAnimationsModule],
      providers: [{ provide: AUTH, useValue: {} }],
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
        MatSnackBarModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [
        {
          provide: AuthService,
          useFactory: (snackbar: SnackbarService, router: Router) => ({
            authLogout: () => {
              snackbar.success(
                SUCCESS_SIGN_OUT_MESSAGE,
                { variant: 'filled', autoClose: true },
                true
              );
              router.navigate(['sign-in']);
            }
          }),
          deps: [SnackbarService, Router]
        }
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
