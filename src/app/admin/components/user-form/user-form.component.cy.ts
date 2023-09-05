import { UserFormComponent } from './user-form.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UserFormComponent', () => {
  it('should mount', () => {
    cy.mount(UserFormComponent, {
      imports: [MatDialogModule, MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        }
      ]
    });
  });
});
