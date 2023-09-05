import { ActionsButtonCellRendererComponent } from './actions-button-cell-renderer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';

describe('ActionsButtonCellRendererComponent', () => {
  it('should mount', () => {
    cy.mount(ActionsButtonCellRendererComponent, {
      imports: [MatSnackBarModule, HttpClientModule, MatDialogModule]
    });
  });
});
