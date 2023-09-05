import { SignUpComponent } from './sign-up.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SignUpComponent', () => {
  it('should mount', () => {
    cy.mount(SignUpComponent, {
      imports: [HttpClientModule, MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    });
  });
});
