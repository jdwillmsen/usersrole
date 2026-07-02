import { Component, Input } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-route-tile',
  imports: [MatCardModule, RouterLink],
  templateUrl: './route-tile.component.html',
  styleUrls: ['./route-tile.component.scss']
})
export class RouteTileComponent {
  @Input() title = '';
  @Input() link = '/';
  @Input() description = '';
  @Input() footer = '';
}
