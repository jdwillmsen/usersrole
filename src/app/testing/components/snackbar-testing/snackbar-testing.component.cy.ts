import { SnackbarTestingComponent } from './snackbar-testing.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SnackbarTestingComponent', () => {
  it('should mount', () => {
    cy.mount(SnackbarTestingComponent, {
      imports: [MatSnackBarModule, BrowserAnimationsModule]
    });
  });
});
