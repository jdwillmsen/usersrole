import { AboutComponent } from './about.component';
import { ActivatedRoute } from '@angular/router';

describe('AboutComponent', () => {
  it('should mount', () => {
    cy.mount(AboutComponent, {
      providers: [{ provide: ActivatedRoute, useValue: {} }]
    });
    cy.getByCy('about-page').should('be.visible');
  });
});
