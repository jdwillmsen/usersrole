export interface Theme {
  primaryPalette: Palette;
  accentPalette: Palette;
  warnPalette: Palette;
  successPalette: Palette;
  errorPalette: Palette;
  infoPalette: Palette;
}

export interface Palette extends Record<string, any> {
  color50: string;
  color100: string;
  color200: string;
  color300: string;
  color400: string;
  color500: string;
  color600: string;
  color700: string;
  color800: string;
  color900: string;
  colorA100: string;
  colorA200: string;
  colorA300: string;
  colorA400: string;
  colorContrast50: string;
  colorContrast100: string;
  colorContrast200: string;
  colorContrast300: string;
  colorContrast400: string;
  colorContrast500: string;
  colorContrast600: string;
  colorContrast700: string;
  colorContrast800: string;
  colorContrast900: string;
  colorContrastA100: string;
  colorContrastA200: string;
  colorContrastA300: string;
  colorContrastA400: string;
}
