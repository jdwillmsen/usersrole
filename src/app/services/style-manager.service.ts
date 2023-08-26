import { Injectable } from '@angular/core';
import { SiteTheme } from '../models/site-theme.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StyleManagerService {
  currentThemeName: Subject<string> = new Subject<string>();
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
      background: '#fafafa',
      button: '#E91E63',
      toolbar: '#3F51B5',
      isDefault: true
    },
    {
      primary: '#7dcf2a',
      accent: '#ff9500',
      displayName: 'User Custom Light',
      name: 'custom-light',
      isDark: false,
      background: '#fafafa',
      button: '#ff9500',
      toolbar: '#7dcf2a'
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
    },
    {
      primary: '#7dcf2a',
      accent: '#ff9500',
      displayName: 'User Custom Dark',
      name: 'custom-dark',
      isDark: true,
      background: '#303030',
      button: '#ff9500',
      toolbar: '#7dcf2a'
    }
  ];

  setStyle(key: string, href: string) {
    getLinkElementForKey(key).setAttribute('href', href);
  }

  removeStyle(key: string) {
    const exisitingLinkElement = getExistingLinkElementByKey(key);
    if (exisitingLinkElement) {
      document.head.removeChild(exisitingLinkElement);
    }
  }
}

function getLinkElementForKey(key: string) {
  return getExistingLinkElementByKey(key) || createLinkElementWithKey(key);
}

function getExistingLinkElementByKey(key: string) {
  return document.head.querySelector(
    `link[rel="stylesheet"].${getClassNameForKey(key)}`
  );
}

function createLinkElementWithKey(key: string) {
  const linkEl = document.createElement('link');
  linkEl.setAttribute('rel', 'stylesheet');
  linkEl.classList.add(getClassNameForKey(key));
  document.head.appendChild(linkEl);
  return linkEl;
}

function getClassNameForKey(key: string) {
  return `style-manager-${key}`;
}
