import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import { AlertVariants } from './alert.model';
import { Direction } from '@angular/cdk/bidi';

export type SnackbarData = {
  message: string;
  icon?: string;
  buttonText?: string;
};

export interface SnackbarOptions {
  variant?: AlertVariants;
  autoClose?: boolean;
  autoCloseTimeout?: number;
  icon?: string;
  buttonText?: string;
  direction?: Direction;
  horizontalPosition?: MatSnackBarHorizontalPosition;
  verticalPosition?: MatSnackBarVerticalPosition;
}
