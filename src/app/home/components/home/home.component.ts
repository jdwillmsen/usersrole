import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { RouteTileComponent } from '../route-tile/route-tile.component';
import { NgForOf } from '@angular/common';

type RouteTile = {
  title: string;
  link: string;
  description: string;
  access: string[];
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [MatButtonModule, RouterLink, RouteTileComponent, NgForOf]
})
export class HomeComponent {
  routes: RouteTile[] = [
    {
      title: 'Home',
      link: '/home',
      description: 'This is the home link and is currently being displayed.',
      access: ['Everyone']
    },
    {
      title: 'Profile',
      link: '/profile',
      description:
        'This is a profile page for viewing information about the logged in user.',
      access: ['Everyone']
    },
    {
      title: 'Alerts',
      link: '/testing/alerts',
      description:
        'This is a page for viewing the alert service/alerts provided in this application.',
      access: ['Everyone']
    },
    {
      title: 'Snackbars',
      link: '/testing/alerts',
      description:
        'This is a page for viewing the snackbar service/snackbars provided in this application.',
      access: ['Everyone']
    },
    {
      title: 'Buttons',
      link: '/testing/buttons',
      description:
        'This is a page for viewing the additional palettes applied on buttons provided in this application.',
      access: ['Everyone']
    },
    {
      title: 'Palettes',
      link: '/theme/view',
      description:
        'This is a page for viewing the different color palettes for the current theme.',
      access: ['Everyone']
    },
    {
      title: 'Theme',
      link: '/theme/create',
      description: 'This is a page for creating a custom theme.',
      access: ['Everyone']
    },
    {
      title: 'Users',
      link: '/admin/users',
      description:
        'This is a page for viewing all the users associated with the application.',
      access: ['Read', 'Admin', 'Manager']
    },
    {
      title: 'Roles',
      link: '/admin/roles',
      description: 'This is the home link and is currently being displayed.',
      access: ['Read', 'Admin', 'Manager']
    }
  ];
}
