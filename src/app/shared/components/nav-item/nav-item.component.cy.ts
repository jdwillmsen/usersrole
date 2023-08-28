import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { NavItemComponent } from './nav-item.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';

describe('NavItemComponent', () => {
  it('can mount', () => {
    cy.mount(NavItemComponent);
  });

  it('testing the title is displayed properly', () => {
    cy.mount(NavItemComponent, {
      componentProperties: {
        navItem: { path: '/home', icon: 'home', title: 'Home' },
        isExpanded: true
      },
      imports: [MatIconModule, RouterModule, RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    cy.getByCy('nav-icon').should('be.visible');
    cy.getByCy('nav-title').should('be.visible').and('have.text', 'Home');
  });
});
