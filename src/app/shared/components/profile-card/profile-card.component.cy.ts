import { ProfileCardComponent } from './profile-card.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../../environments/environment';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ProfileCardComponent', () => {
  it('should mount', () => {
    cy.mount(ProfileCardComponent, {
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule
      ],
      componentProperties: {
        user: undefined
      }
    });
  });
});
