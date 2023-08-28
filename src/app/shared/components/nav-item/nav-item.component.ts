import { Component, Input } from '@angular/core';
import { NavItem } from '../../models/nav-item.model';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent {
  @Input() navItem!: NavItem;
  @Input() isExpanded = false;
}
