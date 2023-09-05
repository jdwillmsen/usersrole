import { AlertTestingComponent } from './alert-testing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AlertTestingComponent', () => {
  it('should mount', () => {
    cy.mount(AlertTestingComponent, {
      imports: [BrowserAnimationsModule]
    });
  });
});
