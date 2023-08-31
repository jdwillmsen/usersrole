import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertOptions, Icon, Variant } from 'src/app/core/models/alert.model';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { NgFor, NgIf } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-alert-testing',
  templateUrl: './alert-testing.component.html',
  styleUrls: ['./alert-testing.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatOptionModule,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    AlertComponent
  ]
})
export class AlertTestingComponent {
  options: AlertOptions = {
    autoClose: false,
    autoCloseTimeout: 3000,
    keepAfterRouteChange: false,
    icon: undefined,
    closeButton: true,
    maxSize: undefined
  };
  defaultIcons = false;
  fade = false;
  fadeTime = 500;
  iconList: Icon[] = [
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
  ];
  variantList: Variant[] = [
    {
      display: 'Default',
      value: 'default'
    },
    {
      display: 'Filled',
      value: 'filled'
    },
    {
      display: 'Outlined',
      value: 'outlined'
    }
  ];
  variant = new FormControl(this.variantList[0]);

  constructor(protected alertService: AlertService) {}
}
