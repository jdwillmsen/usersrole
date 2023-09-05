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
});
