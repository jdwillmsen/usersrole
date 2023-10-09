import { FirestoreService } from './firestore.service';
import { expect } from '@jest/globals';
import * as firestoreModule from '@angular/fire/firestore';
import { doc } from '@angular/fire/firestore';
import { Theme } from '../../models/theme.model';

describe('FirestoreService', () => {
  let firestoreService: FirestoreService;
  const firestoreMock: jest.Mocked<any> = {};
  const uid = 'user-uid';
  const themeName = 'indigo-pink';
  const theme: Theme = {
    primaryPalette: {
      color50: '#ffffff',
      color100: '#dbf3c3',
      color200: '#bfe994',
      color300: '#9bdd59',
      color400: '#8cd83f',
      color500: '#7dcf2a',
      color600: '#6eb625',
      color700: '#5e9c20',
      color800: '#4f831b',
      color900: '#406915',
      colorA100: '#dbfeb8',
      colorA200: '#c9fd95',
      colorA400: '#97eb41',
      colorA700: '#70bf20',
      colorContrast50: '#000000ff',
      colorContrast100: '#000000ff',
      colorContrast200: '#000000ff',
      colorContrast300: '#000000ff',
      colorContrast400: '#000000ff',
      colorContrast500: '#000000ff',
      colorContrast600: '#000000ff',
      colorContrast700: '#ffffff',
      colorContrast800: '#ffffff',
      colorContrast900: '#ffffff',
      colorContrastA100: '#000000ff',
      colorContrastA200: '#000000ff',
      colorContrastA400: '#000000ff',
      colorContrastA700: '#000000ff'
    },
    accentPalette: {
      color50: '#fff7fe',
      color100: '#ffabf9',
      color200: '#ff73f4',
      color300: '#ff2bef',
      color400: '#ff0ded',
      color500: '#ed00db',
      color600: '#ce00bf',
      color700: '#b000a2',
      color800: '#910086',
      color900: '#73006a',
      colorA100: '#ffabf9',
      colorA200: '#ff87f6',
      colorA400: '#ff21ee',
      colorA700: '#d300c3',
      colorContrast50: '#000000ff',
      colorContrast100: '#000000ff',
      colorContrast200: '#000000ff',
      colorContrast300: '#000000ff',
      colorContrast400: '#ffffff',
      colorContrast500: '#ffffff',
      colorContrast600: '#ffffff',
      colorContrast700: '#ffffff',
      colorContrast800: '#ffffff',
      colorContrast900: '#ffffff',
      colorContrastA100: '#000000ff',
      colorContrastA200: '#000000ff',
      colorContrastA400: '#ffffff',
      colorContrastA700: '#ffffff'
    },
    warnPalette: {
      color50: '#ffffff',
      color100: '#ffe4bd',
      color200: '#ffce85',
      color300: '#ffb13d',
      color400: '#ffa41f',
      color500: '#ff9800',
      color600: '#e08600',
      color700: '#c27400',
      color800: '#a36100',
      color900: '#854f00',
      colorA100: '#ffe4bd',
      colorA200: '#ffd699',
      colorA400: '#ffad33',
      colorA700: '#e68900',
      colorContrast50: '#000000ff',
      colorContrast100: '#000000ff',
      colorContrast200: '#000000ff',
      colorContrast300: '#000000ff',
      colorContrast400: '#000000ff',
      colorContrast500: '#000000ff',
      colorContrast600: '#000000ff',
      colorContrast700: '#ffffff',
      colorContrast800: '#ffffff',
      colorContrast900: '#ffffff',
      colorContrastA100: '#000000ff',
      colorContrastA200: '#000000ff',
      colorContrastA400: '#000000ff',
      colorContrastA700: '#000000ff'
    },
    successPalette: {
      color50: '#ffffff',
      color100: '#ceeacf',
      color200: '#a7d9a9',
      color300: '#75c378',
      color400: '#60ba63',
      color500: '#4caf50',
      color600: '#439a46',
      color700: '#39843c',
      color800: '#306f33',
      color900: '#275a29',
      colorA100: '#c3f4c5',
      colorA200: '#a5efa8',
      colorA400: '#5ed063',
      colorA700: '#3fa343',
      colorContrast50: '#000000ff',
      colorContrast100: '#000000ff',
      colorContrast200: '#000000ff',
      colorContrast300: '#000000ff',
      colorContrast400: '#000000ff',
      colorContrast500: '#000000ff',
      colorContrast600: '#ffffff',
      colorContrast700: '#ffffff',
      colorContrast800: '#ffffff',
      colorContrast900: '#ffffff',
      colorContrastA100: '#000000ff',
      colorContrastA200: '#000000ff',
      colorContrastA400: '#000000ff',
      colorContrastA700: '#ffffff'
    },
    errorPalette: {
      color50: '#ffffff',
      color100: '#feeae9',
      color200: '#fbb9b4',
      color300: '#f77970',
      color400: '#f65e53',
      color500: '#f44336',
      color600: '#f22819',
      color700: '#e11b0c',
      color800: '#c3170b',
      color900: '#a61409',
      colorA100: '#ffe9e8',
      colorA200: '#ffc8c4',
      colorA400: '#ff695e',
      colorA700: '#f92718',
      colorContrast50: '#000000ff',
      colorContrast100: '#000000ff',
      colorContrast200: '#000000ff',
      colorContrast300: '#000000ff',
      colorContrast400: '#000000ff',
      colorContrast500: '#ffffff',
      colorContrast600: '#ffffff',
      colorContrast700: '#ffffff',
      colorContrast800: '#ffffff',
      colorContrast900: '#ffffff',
      colorContrastA100: '#000000ff',
      colorContrastA200: '#000000ff',
      colorContrastA400: '#000000ff',
      colorContrastA700: '#ffffff'
    },
    infoPalette: {
      color50: '#ffffff',
      color100: '#d4ebfd',
      color200: '#9fd1fa',
      color300: '#5bb1f6',
      color400: '#3ea4f5',
      color500: '#2196f3',
      color600: '#0d87e9',
      color700: '#0b76cc',
      color800: '#0966af',
      color900: '#085592',
      colorA100: '#d2ebff',
      colorA200: '#aedbff',
      colorA400: '#48aeff',
      colorA700: '#078bf4',
      colorContrast50: '#000000ff',
      colorContrast100: '#000000ff',
      colorContrast200: '#000000ff',
      colorContrast300: '#000000ff',
      colorContrast400: '#000000ff',
      colorContrast500: '#ffffff',
      colorContrast600: '#ffffff',
      colorContrast700: '#ffffff',
      colorContrast800: '#ffffff',
      colorContrast900: '#ffffff',
      colorContrastA100: '#000000ff',
      colorContrastA200: '#000000ff',
      colorContrastA400: '#000000ff',
      colorContrastA700: '#ffffff'
    }
  };

  beforeEach(() => {
    firestoreService = new FirestoreService(firestoreMock);
  });

  it('should create an instance of FirestoreService', () => {
    expect(firestoreService).toBeInstanceOf(FirestoreService);
  });

  it('should fetch user document with data', async () => {
    const userDocData = { theme: themeName };
    const docSpy = jest.spyOn(firestoreModule, 'doc');
    const getDocSpy = jest.spyOn(firestoreModule, 'getDoc');
    docSpy.mockImplementation((firestore, path, uid) => ({} as any));
    getDocSpy.mockImplementation(
      (docRef) =>
        ({
          exists: () => true,
          data: () => userDocData
        } as any)
    );

    const result = await firestoreService.getUsersDoc(uid);

    expect(docSpy).toHaveBeenCalled();
    expect(getDocSpy).toHaveBeenCalled();
    expect(result).toEqual(userDocData);
  });

  it('should return null when users data does not exist', async () => {
    const docSpy = jest.spyOn(firestoreModule, 'doc');
    const getDocSpy = jest.spyOn(firestoreModule, 'getDoc');
    docSpy.mockImplementation((firestore, path, uid) => ({} as any));
    getDocSpy.mockImplementation(
      (docRef) =>
        ({
          exists: () => false,
          data: () => null
        } as any)
    );

    const result = await firestoreService.getUsersDoc(uid);

    expect(docSpy).toHaveBeenCalled();
    expect(getDocSpy).toHaveBeenCalled();
    expect(result).toEqual(null);
  });

  it('should set theme name', () => {
    const docSpy = jest.spyOn(firestoreModule, 'doc');
    const setDocSpy = jest.spyOn(firestoreModule, 'setDoc');
    docSpy.mockImplementation((firestore, path, uid) => ({} as any));
    setDocSpy.mockImplementation(
      (docRef, data, options) => new Promise(() => true)
    );

    firestoreService.setThemeName(uid, themeName);

    expect(docSpy).toHaveBeenCalled();
    expect(setDocSpy).toHaveBeenCalled();
  });

  it('should set custom light theme', () => {
    const docSpy = jest.spyOn(firestoreModule, 'doc');
    const setDocSpy = jest.spyOn(firestoreModule, 'setDoc');
    docSpy.mockImplementation((firestore, path, uid) => ({} as any));
    setDocSpy.mockImplementation(
      (docRef, data, options) => new Promise(() => true)
    );

    firestoreService.setCustomLightTheme(uid, theme);

    expect(docSpy).toHaveBeenCalled();
    expect(setDocSpy).toHaveBeenCalled();
  });

  it('should set custom dark theme', () => {
    const docSpy = jest.spyOn(firestoreModule, 'doc');
    const setDocSpy = jest.spyOn(firestoreModule, 'setDoc');
    docSpy.mockImplementation((firestore, path, uid) => ({} as any));
    setDocSpy.mockImplementation(
      (docRef, data, options) => new Promise(() => true)
    );

    firestoreService.setCustomDarkTheme(uid, theme);

    expect(docSpy).toHaveBeenCalled();
    expect(setDocSpy).toHaveBeenCalled();
  });

  it('should retrieve user doc', () => {
    const docSpy = jest.spyOn(firestoreModule, 'doc');
    docSpy.mockImplementation((firestore, path, uid) => ({} as any));

    firestoreService.getUserDoc(uid);

    expect(docSpy).toHaveBeenCalled();
  });
});
