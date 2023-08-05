import { PaletteColors } from './palette-colors.model';

export interface Alert {
  id?: string;
  type?: PaletteColors;
  message?: string;
  autoClose?: boolean;
  autoCloseTimeout?: number;
  keepAfterRouteChange?: boolean;
  fade?: boolean;
  fadeTime?: number;
  icon?: string;
  closeButton?: boolean;
  maxSize?: number;
}

export interface AlertOptions {
  id?: string;
  autoClose?: boolean;
  autoCloseTimeout?: number;
  keepAfterRouteChange?: boolean;
  icon?: string;
  closeButton?: boolean;
  maxSize?: number;
}
