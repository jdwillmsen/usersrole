import { NavItemComponent } from './nav-item.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

describe('NavItemComponent', () => {
  it('can mount', () => {
    cy.mount(NavItemComponent, {
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    });
  });

  it('testing the title is displayed properly', () => {
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
});
