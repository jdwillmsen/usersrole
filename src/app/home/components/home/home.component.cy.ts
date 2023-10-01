import { HomeComponent } from './home.component';
import { ActivatedRoute } from '@angular/router';

describe('HomeComponent', () => {
  it('should mount', () => {
    cy.mount(HomeComponent, {
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    });
  });

  it('should be setup properly', () => {
    cy.mount(HomeComponent, {
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    });
    cy.getByCy('title').should('be.visible').and('contain.text', 'Users Role');
    cy.getByCy('p1').should('be.visible').and('not.be.empty');
    cy.getByCy('p2').should('be.visible').and('not.be.empty');
    cy.getByCy('p3').should('be.visible').and('not.be.empty');
    cy.getByCy('p4').should('be.visible').and('not.be.empty');
    cy.getByCy('readMessage').should('be.visible').and('not.be.empty');
    cy.getByCy('home-tile').should('be.visible');
    cy.getByCy('profile-tile').should('be.visible');
    cy.getByCy('alerts-tile').should('be.visible');
    cy.getByCy('snackbars-tile').should('be.visible');
    cy.getByCy('buttons-tile').should('be.visible');
    cy.getByCy('palettes-tile').should('be.visible');
    cy.getByCy('theme-tile').should('be.visible');
    cy.getByCy('users-tile').should('be.visible');
    cy.getByCy('roles-tile').should('be.visible');
  });
});
