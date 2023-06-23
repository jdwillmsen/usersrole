import { Component } from '@angular/core';
import { NavItem } from 'src/app/models/nav-item.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
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
    },
    {
      path: '/users',
      icon: 'supervised_user_circle',
      title: 'Users'
    }
  ];
  user: any;

  constructor(private authService: AuthService) {
    authService.user$.subscribe((user) => (this.user = user));
  }

  toggleSideNav() {
    this.isExpanded = !this.isExpanded;
  }
}
