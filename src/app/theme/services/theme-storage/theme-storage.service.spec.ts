import { expect } from '@jest/globals';
import { ThemeStorageService } from './theme-storage.service';
import { SiteTheme } from '../../../core/models/site-theme.model';

describe('ThemeStorageService', () => {
  let themeStorageService: ThemeStorageService;
  const storageKey = 'theme-storage-current-name';
  const defaultTheme: SiteTheme = {
    primary: '#3F51B5',
    accent: '#E91E63',
    displayName: 'Indigo & Pink',
    name: 'indigo-pink',
    isDark: false,
    background: '#fafafa',
    button: '#E91E63',
    toolbar: '#3F51B5',
    isDefault: true
  };

  beforeEach(() => {
    window.localStorage.clear();
    themeStorageService = new ThemeStorageService();
  });

  it('should create an instance of ThemeStorageService', () => {
    expect(themeStorageService).toBeInstanceOf(ThemeStorageService);
  });

  it('should store a theme', () => {
    const localStorageSetItemSpy = jest.spyOn(
      Object.getPrototypeOf(window.localStorage),
      'setItem'
    );
    Object.setPrototypeOf(window.localStorage.setItem, jest.fn());
    const emitSpy = jest.spyOn(themeStorageService.onThemeUpdate, 'emit');

    themeStorageService.storeTheme(defaultTheme);

    expect(localStorageSetItemSpy).toHaveBeenCalledWith(
      storageKey,
      defaultTheme.name
    );
    expect(emitSpy).toHaveBeenCalledWith(defaultTheme);
  });

  it('should handle errors when storing a theme', () => {
    const localStorageSetItemSpy = jest.spyOn(
      Object.getPrototypeOf(window.localStorage),
      'setItem'
    );
    Object.setPrototypeOf(window.localStorage.setItem, jest.fn());
    localStorageSetItemSpy.mockImplementation(() => {
      throw new Error('localStorage unavailable');
    });
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    themeStorageService.storeTheme(defaultTheme);

    expect(localStorageSetItemSpy).toHaveBeenCalledWith(
      storageKey,
      defaultTheme.name
    );
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('should get stored theme name', () => {
    const storedThemeName = 'dark';
    const localStorageGetItemSpy = jest.spyOn(
      Object.getPrototypeOf(window.localStorage),
      'getItem'
    );
    Object.setPrototypeOf(window.localStorage.getItem, jest.fn());
    localStorageGetItemSpy.mockReturnValueOnce(storedThemeName);

    const result = themeStorageService.getStoredThemeName();

    expect(localStorageGetItemSpy).toHaveBeenCalledWith(storageKey);
    expect(result).toBe(storedThemeName);
  });

  it('should return null for getStoredThemeName when localStorage is unavailable', () => {
    const localStorageGetItemSpy = jest.spyOn(
      Object.getPrototypeOf(window.localStorage),
      'getItem'
    );
    Object.setPrototypeOf(window.localStorage.getItem, jest.fn());
    localStorageGetItemSpy.mockImplementation(() => {
      throw new Error('localStorage unavailable');
    });

    const result = themeStorageService.getStoredThemeName();

    expect(localStorageGetItemSpy).toHaveBeenCalledWith(storageKey);
    expect(result).toBeNull();
  });

  it('should clear storage', () => {
    const localStorageRemoveItemSpy = jest.spyOn(
      Object.getPrototypeOf(window.localStorage),
      'removeItem'
    );
    Object.setPrototypeOf(window.localStorage.removeItem, jest.fn());

    themeStorageService.clearStorage();

    expect(localStorageRemoveItemSpy).toHaveBeenCalledWith(storageKey);
  });

  it('should handle errors when clearing storage', () => {
    const localStorageRemoveItemSpy = jest.spyOn(
      Object.getPrototypeOf(window.localStorage),
      'removeItem'
    );
    Object.setPrototypeOf(window.localStorage.removeItem, jest.fn());
    localStorageRemoveItemSpy.mockImplementation(() => {
      throw new Error('localStorage unavailable');
    });
    const consoleErrorSpy = jest.spyOn(console, 'error').mockReturnValue();

    themeStorageService.clearStorage();

    expect(localStorageRemoveItemSpy).toHaveBeenCalledWith(storageKey);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
