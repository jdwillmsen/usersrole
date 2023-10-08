import { CreateThemeComponent } from './create-theme.component';
import { Firestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FirestoreService } from '../../../core/services/firestore/firestore.service';

describe('CreateThemeComponent', () => {
  it('should mount', () => {
    cy.mount(CreateThemeComponent, {
      imports: [MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        {
          provide: Firestore,
          useValue: {}
        },
        {
          provide: AngularFireAuth,
          useValue: {}
        },
        {
          provide: AuthService,
          useValue: {
            user$: of({ uid: 'test-uid-1' })
          }
        }
      ]
    });
  });

  it('should be properly setup', () => {
    cy.mount(CreateThemeComponent, {
      imports: [MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        {
          provide: Firestore,
          useValue: {}
        },
        {
          provide: AngularFireAuth,
          useValue: {}
        },
        {
          provide: AuthService,
          useValue: {
            user$: of({ uid: 'test-uid-1' })
          }
        }
      ]
    });
    cy.getByCy('title')
      .should('be.visible')
      .and('contain.text', 'Create Custom Theme');
    cy.getByCy('save-light-theme-button')
      .should('be.visible')
      .and('contain.text', 'Save Light Theme');
    cy.getByCy('save-dark-theme-button')
      .should('be.visible')
      .and('contain.text', 'Save Dark Theme');
    cy.getByCy('primary-palette').should('be.visible');
    cy.getByCy('accent-palette').should('be.visible');
    cy.getByCy('info-palette').should('be.visible');
    cy.getByCy('error-palette').should('be.visible');
    cy.getByCy('success-palette').should('be.visible');
    cy.getByCy('warn-palette').should('be.visible');
  });

  it('should save the themes', () => {
    cy.mount(CreateThemeComponent, {
      imports: [MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        {
          provide: Firestore,
          useValue: {}
        },
        {
          provide: AngularFireAuth,
          useValue: {}
        },
        {
          provide: AuthService,
          useValue: {
            user$: of({ uid: 'test-uid-1' })
          }
        },
        {
          provide: FirestoreService,
          useValue: {
            setCustomLightTheme: () => {
              return new Promise((resolve) => {
                resolve(true);
              });
            },
            setCustomDarkTheme: () => {
              return new Promise((resolve) => {
                resolve(true);
              });
            }
          }
        }
      ]
    });
    cy.getByCy('primary-palette').within(() => {
      changeColor('main', '#ff5349');
    });
    cy.getByCy('accent-palette').within(() => {
      changeColor('main', '#f4c430');
    });
    cy.getByCy('warn-palette').within(() => {
      changeColor('main', '#ff9800');
    });
    cy.getByCy('success-palette').within(() => {
      changeColor('main', '#4caf50');
    });
    cy.getByCy('error-palette').within(() => {
      changeColor('main', '#e006b8');
    });
    cy.getByCy('info-palette').within(() => {
      changeColor('main', '#2196f3');
    });
    cy.getByCy('save-light-theme-button').click();
    cy.getByCy('snackbar-container')
      .should('be.visible')
      .and('contain.text', 'Saved light theme successfully');
    cy.getByCy('save-dark-theme-button').click();
    cy.getByCy('snackbar-container')
      .should('be.visible')
      .and('contain.text', 'Saved dark theme successfully');
  });
});

function changeColor(colorSelectorNumber: string, colorValue: string) {
  cy.changeColor(`${colorSelectorNumber}-color-input`, colorValue);
}
