import { Component, Input } from '@angular/core';
import { NavItem } from '../../models/nav-item.model';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
  standalone: true,
  imports: [MatListModule, RouterLink, RouterLinkActive, MatIconModule, NgIf]
})
export class NavItemComponent {
  @Input() navItem!: NavItem;
  @Input() isExpanded = false;
}
