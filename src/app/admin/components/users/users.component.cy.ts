import { UsersComponent } from './users.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UsersComponent', () => {
  it('should mount', () => {
    cy.mount(UsersComponent, {
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        MatDialogModule,
        BrowserAnimationsModule
      ]
    });
  });
});
