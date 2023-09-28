import { RouteTileComponent } from './route-tile.component';
import { ActivatedRoute } from '@angular/router';

describe('TileComponent', () => {
  it('should mount', () => {
    cy.mount(RouteTileComponent, {
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    });
  });

  it('should have default set', () => {
    cy.mount(RouteTileComponent, {
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    });
    cy.getByCy('title').should('have.text', '');
    cy.getByCy('message').should('have.text', '');
    cy.getByCy('access').should('be.visible').and('contain.text', 'Access:');
  });

  it('should be setup properly', () => {
    cy.mount(RouteTileComponent, {
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ],
      componentProperties: {
        title: 'Test',
        link: '/test',
        description: 'test description',
        footer: 'tester'
      }
    });
    cy.getByCy('title').should('be.visible').and('contain.text', 'Test');
    cy.getByCy('message')
      .should('be.visible')
      .and('contain.text', 'test description');
    cy.getByCy('access').should('be.visible').and('contain.text', 'tester');
    cy.getByCy('access-title')
      .should('be.visible')
      .and('contain.text', 'Access:');
  });
});
