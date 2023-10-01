import { NavItemComponent } from './nav-item.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavItemComponent', () => {
  it('should mount', () => {
    cy.mount(NavItemComponent, {
      componentProperties: {
        navItem: { path: '/home', icon: 'home', title: 'Home' }
      },
      imports: [MatIconModule, RouterTestingModule]
    });
  });

  it('should be setup properly expanded', () => {
    cy.mount(NavItemComponent, {
      componentProperties: {
        navItem: { path: '/home', icon: 'home', title: 'Home' },
        isExpanded: true
      },
      imports: [MatIconModule, RouterTestingModule]
    });
    cy.getByCy('nav-icon').should('be.visible');
    cy.getByCy('nav-title').should('be.visible').and('contain.text', 'Home');
  });

  it('should be setup properly collapsed', () => {
    cy.mount(NavItemComponent, {
      componentProperties: {
        navItem: { path: '/home', icon: 'home', title: 'Home' },
        isExpanded: false
      },
      imports: [MatIconModule, RouterTestingModule]
    });
    cy.getByCy('nav-icon').should('be.visible');
  });
});
