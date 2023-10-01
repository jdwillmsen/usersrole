import { expect } from '@jest/globals';
import { StyleManagerService } from './style-manager.service';

describe('StyleManagerService', () => {
  let styleManagerService: StyleManagerService;

  beforeEach(() => {
    document.head.innerHTML = '';
    styleManagerService = new StyleManagerService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance of StyleManagerService', () => {
    expect(styleManagerService).toBeInstanceOf(StyleManagerService);
  });

  it('should return an array of themes', () => {
    const themes = styleManagerService.getThemes();
    expect(themes).toEqual([
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
    ]);
  });

  it('should set a style', () => {
    const key = 'someKey';
    const href = 'someHref';

    styleManagerService.setStyle(key, href);

    const linkElement = document.head.querySelector(
      `link[rel="stylesheet"].style-manager-${key}`
    );
    expect(linkElement).toBeTruthy();
    expect(linkElement?.getAttribute('href')).toBe(href);
  });

  it('should remove a style', () => {
    const key = 'someKey';
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.classList.add(`style-manager-${key}`);
    document.head.appendChild(linkElement);

    styleManagerService.removeStyle(key);

    const removedLinkElement = document.head.querySelector(
      `link[rel="stylesheet"].style-manager-${key}`
    );
    expect(removedLinkElement).toBeNull();
  });
});
