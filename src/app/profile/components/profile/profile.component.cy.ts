import { ProfileComponent } from './profile.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProfileComponent', () => {
  it('should mount', () => {
    cy.mount(ProfileComponent, {
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        HttpClientModule,
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: {}
        }
      ]
    });
  });

  it('should be setup properly', () => {
    cy.mount(ProfileComponent, {
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        HttpClientModule,
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: {}
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
