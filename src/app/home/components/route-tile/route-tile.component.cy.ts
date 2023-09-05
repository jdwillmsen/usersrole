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
});
