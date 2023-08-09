import { PaletteColors } from './palette-colors.model';

export type AlertVariants = 'default' | 'filled' | 'outlined';

export type Variant = {
  display: string;
  value: AlertVariants;
};

export type Icon = {
  display: string;
  value: string;
};

export interface Alert {
  id?: string;
  type?: PaletteColors;
  variant?: AlertVariants;
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
