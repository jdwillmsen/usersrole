import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-route-tile',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterLink],
  templateUrl: './route-tile.component.html',
  styleUrls: ['./route-tile.component.scss']
})
export class RouteTileComponent {
  @Input() title: string = '';
  @Input() link: string = '/';
  @Input() description: string = '';
  @Input() footer: string = '';
}
