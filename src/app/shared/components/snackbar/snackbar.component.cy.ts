import { SnackbarComponent } from './snackbar.component';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef
} from '@angular/material/snack-bar';

describe('SnackbarComponent', () => {
  it('should mount', () => {
    cy.mount(SnackbarComponent, {
      imports: [],
      providers: [
        {
          provide: MatSnackBarRef,
          useValue: {}
        },
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: {}
        }
      ]
    });
  });
});
