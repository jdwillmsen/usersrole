import { RolesComponent } from './roles.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RolesComponent', () => {
  it('should mount', () => {
    cy.mount(RolesComponent, {
      imports: [HttpClientModule, MatSnackBarModule, BrowserAnimationsModule]
    });
  });
});
