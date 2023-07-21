import { Component } from '@angular/core';
import { SiteTheme } from 'src/app/models/site-theme.model';
import { StyleManagerService } from 'src/app/services/style-manager.service';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.scss']
})
export class ThemeSelectorComponent {
  currentTheme: SiteTheme | undefined;
  themes: SiteTheme[] = [
    {
      primary: '#FFFFFF',
      accent: '#000000',
      displayName: 'Black & White',
      name: 'black-white',
      isDark: false,
      background: '#fafafa',
      button: '#FFFFFF',
      toolbar: '#000000'
    },
    {
      primary: '#673AB7',
      accent: '#FFC107',
      displayName: 'Deep Purple & Amber',
      name: 'deeppurple-amber',
      isDark: false,
      background: '#fafafa',
      button: '#FFC107',
      toolbar: '#673AB7'
    },
    {
      primary: '#3F51B5',
      accent: '#E91E63',
      displayName: 'Indigo & Pink',
      name: 'indigo-pink',
      isDark: false,
      isDefault: true,
      background: '#fafafa',
      button: '#E91E63',
      toolbar: '#3F51B5'
    },
    {
      primary: '#E91E63',
      accent: '#607D8B',
      displayName: 'Pink & Blue-grey',
      name: 'pink-bluegrey',
      isDark: true,
      background: '#303030',
      button: '#607D8B',
      toolbar: '#E91E63'
    },
    {
      primary: '#9C27B0',
      accent: '#4CAF50',
      displayName: 'Purple & Green',
      name: 'purple-green',
      isDark: true,
      background: '#303030',
      button: '#4CAF50',
      toolbar: '#9C27B0'
    },
    {
      primary: '#FF0000',
      accent: '#00FFFF',
      displayName: 'Red & Teal',
      name: 'red-teal',
      isDark: true,
      background: '#303030',
      button: '#00FFFF',
      toolbar: '#FF0000'
    }
  ];

  constructor(private styleManagerService: StyleManagerService) {
    this.themes.find((themes) => {
      if (themes.isDefault === true) {
        this.selectTheme(themes.name);
      }
    });
  }

  selectTheme(themeName: string) {
    const theme = this.themes.find(
      (currentTheme) => currentTheme.name === themeName
    );

    if (!theme) {
      return;
    }

    this.currentTheme = theme;

    if (theme.isDefault) {
      this.styleManagerService.removeStyle('theme');
    } else {
      this.styleManagerService.setStyle('theme', `${theme.name}.css`);
    }

    if (this.currentTheme) {
      // TODO: Implement storage theme, check out this: https://github.com/angular/material.angular.io/blob/main/src/app/shared/theme-picker/theme-storage/theme-storage.ts
      // this._themeStorage.storeTheme(this.currentTheme);
    }
  }
}
