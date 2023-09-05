import { FormControl } from '@angular/forms';

export class PaletteFormGroup {
  darkTextColor = '#000000FF';
  lightTextColor = '#FFFFFF';

  paletteFormGroup: Record<string, FormControl<String>> = {
    color50: new FormControl('#FFFFFF', {
      nonNullable: true
    }),
    color100: new FormControl('#DEDEDE', {
      nonNullable: true
    }),
    color200: new FormControl('#C2C2C2', {
      nonNullable: true
    }),
    color300: new FormControl('#9F9F9F', {
      nonNullable: true
    }),
    color400: new FormControl('#8F8F8F', {
      nonNullable: true
    }),
    color500: new FormControl('#808080', {
      nonNullable: true
    }),
    color600: new FormControl('#717171', {
      nonNullable: true
    }),
    color700: new FormControl('#616161', {
      nonNullable: true
    }),
    color800: new FormControl('#525252', {
      nonNullable: true
    }),
    color900: new FormControl('#434343', {
      nonNullable: true
    }),
    colorA100: new FormControl('#EEEEEE', {
      nonNullable: true
    }),
    colorA200: new FormControl('#C3C1C3', {
      nonNullable: true
    }),
    colorA400: new FormControl('#909090', {
      nonNullable: true
    }),
    colorA700: new FormControl('#535353', {
      nonNullable: true
    }),
    colorContrast50: new FormControl(this.darkTextColor, {
      nonNullable: true
    }),
    colorContrast100: new FormControl(this.darkTextColor, {
      nonNullable: true
    }),
    colorContrast200: new FormControl(this.darkTextColor, {
      nonNullable: true
    }),
    colorContrast300: new FormControl(this.darkTextColor, {
      nonNullable: true
    }),
    colorContrast400: new FormControl(this.darkTextColor, {
      nonNullable: true
    }),
    colorContrast500: new FormControl(this.darkTextColor, {
      nonNullable: true
    }),
    colorContrast600: new FormControl(this.lightTextColor, {
      nonNullable: true
    }),
    colorContrast700: new FormControl(this.lightTextColor, {
      nonNullable: true
    }),
    colorContrast800: new FormControl(this.lightTextColor, {
      nonNullable: true
    }),
    colorContrast900: new FormControl(this.lightTextColor, {
      nonNullable: true
    }),
    colorContrastA100: new FormControl(this.darkTextColor, {
      nonNullable: true
    }),
    colorContrastA200: new FormControl(this.darkTextColor, {
      nonNullable: true
    }),
    colorContrastA400: new FormControl(this.darkTextColor, {
      nonNullable: true
    }),
    colorContrastA700: new FormControl(this.lightTextColor, {
      nonNullable: true
    })
  };
}
