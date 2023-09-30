import { AppComponent } from './app.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

describe('AppComponent', () => {
  beforeEach(() => {
    cy.mount(AppComponent, {
      imports: [
        MatSnackBarModule,
        AngularFireModule.initializeApp(environment.firebase),
        HttpClientModule,
        AppRoutingModule
      ]
    });
  });

  it('should mount', () => {
    console.log('Component mounted successfully');
  });

  it('should be setup properly', () => {
    cy.getByCy('header').should('be.visible');
    cy.getByCy('main').should('be.visible');
  });
});
