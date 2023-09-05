import { ButtonsTestingComponent } from './buttons-testing.component';
import { ActivatedRoute } from '@angular/router';

describe('ButtonsTestingComponent', () => {
  it('should mount', () => {
    cy.mount(ButtonsTestingComponent, {
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    });
  });
});
