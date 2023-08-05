import { Component } from '@angular/core';
import { AlertOptions } from 'src/app/models/alert.model';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-alert-testing',
  templateUrl: './alert-testing.component.html',
  styleUrls: ['./alert-testing.component.scss']
})
export class AlertTestingComponent {
  options: AlertOptions = {
    autoClose: false,
    autoCloseTimeout: 3000,
    keepAfterRouteChange: false,
    icon: undefined,
    closeButton: true,
    maxSize: undefined
  }
  defaultIcons = false;
  fade = false;
  fadeTime = 500;
  iconList = [
    {
      display: 'Delete',
      value: 'delete'
    },
    {
      display: 'Settings',
      value: 'settings'
    },
    {
      display: 'Search',
      value: 'shopping_cart'
    },
    {
      display: 'New Releases',
      value: 'new_releases'
    }
  ]

  constructor(protected alertService: AlertService) {}
}
