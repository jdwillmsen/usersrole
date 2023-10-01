import { ThemeSelectorComponent } from './theme-selector.component';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../../../../environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FirestoreService } from '../../../core/services/firestore/firestore.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { of } from 'rxjs';

describe('ThemeSelectorComponent', () => {
  it('should mount', () => {
    cy.mount(ThemeSelectorComponent, {
      imports: [
        provideFirestore(() => getFirestore()),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: {}
        },
        {
          provide: FirestoreService,
          useValue: {}
        },
        {
          provide: AuthService,
          useValue: {
            user$: of()
          }
        }
      ]
    });
  });

  it('should be setup properly', () => {
    cy.mount(ThemeSelectorComponent, {
      imports: [
        provideFirestore(() => getFirestore()),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: {}
        },
        {
          provide: FirestoreService,
          useValue: {
            setThemeName: (uid: string, themeName: string) => {
              console.log(uid, themeName);
            }
          }
        },
        {
          provide: AuthService,
          useValue: {
            user$: of()
          }
        }
      ]
    });
    cy.getByCy('theme-select-button').should('be.visible').click();
    cy.getByCy('black-white-button').should('be.visible');
    cy.getByCy('black-white-radio-button').should('be.visible');
    cy.getByCy('black-white-display-name')
      .should('be.visible')
      .and('contain.text', 'Black & White');
    cy.getByCy('deeppurple-amber-button').should('be.visible');
    cy.getByCy('deeppurple-amber-radio-button').should('be.visible');
    cy.getByCy('deeppurple-amber-display-name')
      .should('be.visible')
      .and('contain.text', 'Deep Purple & Amber');
    cy.getByCy('indigo-pink-button').should('be.visible');
    cy.getByCy('indigo-pink-radio-button').should('be.visible');
    cy.getByCy('indigo-pink-display-name')
      .should('be.visible')
      .and('contain.text', 'Indigo & Pink');
    cy.getByCy('custom-light-button').should('be.visible');
    cy.getByCy('custom-light-radio-button').should('be.visible');
    cy.getByCy('custom-light-display-name')
      .should('be.visible')
      .and('contain.text', 'User Custom Light');
    cy.getByCy('pink-bluegrey-button').should('be.visible');
    cy.getByCy('pink-bluegrey-radio-button').should('be.visible');
    cy.getByCy('pink-bluegrey-display-name')
      .should('be.visible')
      .and('contain.text', 'Pink & Blue-grey');
    cy.getByCy('purple-green-button').should('be.visible');
    cy.getByCy('purple-green-radio-button').should('be.visible');
    cy.getByCy('purple-green-display-name')
      .should('be.visible')
      .and('contain.text', 'Purple & Green');
    cy.getByCy('red-teal-button').should('be.visible');
    cy.getByCy('red-teal-radio-button').should('be.visible');
    cy.getByCy('red-teal-display-name')
      .should('be.visible')
      .and('contain.text', 'Red & Teal');
    cy.getByCy('custom-dark-button').should('be.visible');
    cy.getByCy('custom-dark-radio-button').should('be.visible');
    cy.getByCy('custom-dark-display-name')
      .should('be.visible')
      .and('contain.text', 'User Custom Dark')
      .click();
  });
});
