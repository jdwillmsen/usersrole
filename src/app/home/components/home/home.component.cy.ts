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
    cy.getByCy('tileHome').should('be.visible');
    cy.getByCy('tileProfile').should('be.visible');
    cy.getByCy('tileAlerts').should('be.visible');
    cy.getByCy('tileSnackbars').should('be.visible');
    cy.getByCy('tileButtons').should('be.visible');
    cy.getByCy('tilePalettes').should('be.visible');
    cy.getByCy('tileTheme').should('be.visible');
    cy.getByCy('tileUsers').should('be.visible');
    cy.getByCy('tileRoles').should('be.visible');
  });
});
