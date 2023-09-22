import { ForbiddenComponent } from './forbidden.component';
import { ActivatedRoute } from '@angular/router';

describe('ForbiddenComponent', () => {
  it('should mount', () => {
    cy.mount(ForbiddenComponent, {
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    });
  });

  it('should be setup properly', () => {
    cy.mount(ForbiddenComponent, {
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    });
    cy.getByCy('number').should('be.visible').and('have.text', '403');
    cy.getByCy('title').should('be.visible').and('have.text', 'Forbidden');
    cy.getByCy('message')
      .should('be.visible')
      .and(
        'contain.text',
        'You do not have permission to access this resource.'
      );
    cy.getByCy('homeButton')
      .should('be.visible')
      .and('contain.text', 'Home')
      .and('be.enabled');
  });
});
