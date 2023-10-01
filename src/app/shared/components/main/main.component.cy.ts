import { MainComponent } from './main.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../../environments/environment';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';

describe('MainComponent', () => {
  it('should mount', () => {
    cy.mount(MainComponent, {
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule,
        HttpClientModule
      ]
    });
  });

  it('should be setup properly', () => {
    cy.mount(MainComponent, {
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule,
        HttpClientModule
      ]
    });
    cy.getByCy('sidenav-content').should('be.visible');
  });
});
