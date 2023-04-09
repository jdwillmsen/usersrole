import { Component } from '@angular/core';
import { NavItem } from './models/nav-item.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isExpanded = false;
  navItems: NavItem[] = [
    {
      path: '/home',
      icon: 'home',
      title: 'Home'
    },
    {
      path: '/upload',
      icon: 'upload',
      title: 'Upload'
    }
  ];

  toggleSideNav() {
    this.isExpanded = !this.isExpanded;
  }
}
