import { SnackbarTestingComponent } from './snackbar-testing.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SnackbarTestingComponent', () => {
  beforeEach(() => {
    cy.mount(SnackbarTestingComponent, {
      imports: [MatSnackBarModule, BrowserAnimationsModule]
    });
  });

  it('should mount', () => {
    console.log('Component mounted successfully');
  });

  testBreakpoint('XSmall Screen', 300, 600);
  testBreakpoint('Small Screen', 800, 800);
  testBreakpoint('Medium Screen', 1200, 800);
  testBreakpoint('Large Screen', 1600, 900);
  testBreakpoint('XLarge Screen', 2560, 1080);
});

function testSnackbarButton(buttonSelector: string) {
  cy.getByCy(buttonSelector).click();
  cy.getByCy('snackbar-container')
    .should('be.visible')
    .within(() => {
      cy.getByCy('message')
        .should('be.visible')
        .and('contain.text', 'Snackbar Message');
      cy.getByCy('close-button').should('be.visible').and('be.enabled');
    });
}

function verifySnackbarContainer() {
  cy.getByCy('snackbar-container')
    .should('be.visible')
    .and('contain.text', 'Component Test')
    .within(() => {
      cy.getByCy('icon').should('be.visible');
      cy.getByCy('close-button').click();
    });
}

function testBreakpoint(name: string, width: number, height: number) {
  describe(name, () => {
    beforeEach(() => cy.viewport(width, height));
    it('should be setup properly', () => {
      cy.getByCy('primary-button')
        .should('be.visible')
        .and('contain.text', 'Primary Snackbar')
        .and('be.enabled');
      cy.getByCy('accent-button')
        .should('be.visible')
        .and('contain.text', 'Accent Snackbar')
        .and('be.enabled');
      cy.getByCy('info-button')
        .should('be.visible')
        .and('contain.text', 'Info Snackbar')
        .and('be.enabled');
      cy.getByCy('error-button')
        .should('be.visible')
        .and('contain.text', 'Error Snackbar')
        .and('be.enabled');
      cy.getByCy('success-button')
        .should('be.visible')
        .and('contain.text', 'Success Snackbar')
        .and('be.enabled');
      cy.getByCy('warn-button')
        .should('be.visible')
        .and('contain.text', 'Warn Snackbar')
        .and('be.enabled');
      cy.getByCy('close-button')
        .should('be.visible')
        .and('contain.text', 'Close Snackbar')
        .and('be.enabled');
      cy.getByCy('auto-close-time-field')
        .should('be.visible')
        .and('contain.text', 'Auto Close Time')
        .find('input')
        .should('contain.value', '3000');
      cy.getByCy('horizontal-position-field')
        .should('be.visible')
        .and('contain.text', 'Horizontal Position');
      cy.getByCy('horizontal-position-select')
        .should('be.visible')
        .should('contain.text', 'end')
        .click();
      cy.getByCy('start-horizontal-option')
        .should('be.visible')
        .and('contain.text', 'start');
      cy.getByCy('end-horizontal-option')
        .should('be.visible')
        .and('contain.text', 'end');
      cy.getByCy('center-horizontal-option')
        .should('be.visible')
        .and('contain.text', 'center');
      cy.getByCy('left-horizontal-option')
        .should('be.visible')
        .and('contain.text', 'left');
      cy.getByCy('right-horizontal-option')
        .should('be.visible')
        .and('contain.text', 'right');
      cy.get('.cdk-overlay-backdrop').first().click({ force: true });
      cy.getByCy('vertical-position-field')
        .should('be.visible')
        .and('contain.text', 'Vertical Position');
      cy.getByCy('vertical-position-select')
        .should('be.visible')
        .should('contain.text', 'bottom')
        .click();
      cy.getByCy('top-vertical-option')
        .should('be.visible')
        .and('contain.text', 'top');
      cy.getByCy('bottom-vertical-option')
        .should('be.visible')
        .and('contain.text', 'bottom');
      cy.get('.cdk-overlay-backdrop').first().click({ force: true });
      cy.getByCy('variant-field')
        .should('be.visible')
        .and('contain.text', 'Variant');
      cy.getByCy('variant-select')
        .should('be.visible')
        .should('contain.text', 'Filled')
        .click();
      cy.getByCy('default-variant-option')
        .should('be.visible')
        .and('contain.text', 'Default');
      cy.getByCy('filled-variant-option')
        .should('be.visible')
        .and('contain.text', 'Filled');
      cy.getByCy('outlined-variant-option')
        .should('be.visible')
        .and('contain.text', 'Outlined');
      cy.get('.cdk-overlay-backdrop').first().click({ force: true });
      cy.getByCy('icon-field')
        .should('be.visible')
        .and('contain.text', 'Icon')
        .click();
      cy.getByCy('none-icon-option')
        .should('be.visible')
        .and('contain.text', 'None');
      cy.getByCy('delete-icon-option')
        .should('be.visible')
        .and('contain.text', 'delete');
      cy.getByCy('settings-icon-option')
        .should('be.visible')
        .and('contain.text', 'settings');
      cy.getByCy('shopping_cart-icon-option')
        .should('be.visible')
        .and('contain.text', 'shopping_cart');
      cy.getByCy('new_releases-icon-option')
        .should('be.visible')
        .and('contain.text', 'new_releases');
      cy.get('.cdk-overlay-backdrop').first().click({ force: true });
      cy.getByCy('button-text-field')
        .should('be.visible')
        .and('contain.text', 'Button Text');
      cy.getByCy('snackbar-message-field')
        .should('be.visible')
        .and('contain.text', 'Snackbar Message');
      cy.getByCy('snackbar-message-textarea')
        .should('be.visible')
        .and('contain.value', 'Snackbar Message');
      cy.getByCy('default-icons-checkbox')
        .should('be.visible')
        .and('contain.text', 'Default Icons')
        .find('input')
        .should('be.enabled')
        .and('not.be.checked');
      cy.getByCy('auto-close-checkbox')
        .should('be.visible')
        .and('contain.text', 'Auto Close')
        .find('input')
        .should('be.enabled')
        .and('not.be.checked');
    });

    it('should show snackbar when button(s) pressed', () => {
      testSnackbarButton('primary-button');
      testSnackbarButton('accent-button');
      testSnackbarButton('info-button');
      testSnackbarButton('error-button');
      testSnackbarButton('success-button');
      testSnackbarButton('warn-button');
      cy.getByCy('close-button').first().click();
      cy.getByCy('snackbar-container').should('not.exist');
    });

    it('should behave appropriately when applying snackbar options', () => {
      cy.getByCy('auto-close-time-field').find('input').type('{backspace}');
      cy.getByCy('horizontal-position-field').click();
      cy.getByCy('start-horizontal-option').click();
      cy.getByCy('vertical-position-field').click();
      cy.getByCy('top-vertical-option').click();
      cy.getByCy('variant-field').click();
      cy.getByCy('default-variant-option').click();
      cy.getByCy('icon-field').click();
      cy.getByCy('new_releases-icon-option').click();
      cy.getByCy('button-text-field').type('Close');
      cy.getByCy('snackbar-message-field').clear().type('Component Test');
      cy.getByCy('default-icons-checkbox').click();
      cy.getByCy('auto-close-checkbox').click();
      cy.getByCy('primary-button').click();
      verifySnackbarContainer();
      cy.getByCy('info-button').click();
      verifySnackbarContainer();
      cy.getByCy('horizontal-position-field').click();
      cy.getByCy('center-horizontal-option').click();
      cy.getByCy('vertical-position-field').click();
      cy.getByCy('bottom-vertical-option').click();
      cy.getByCy('variant-field').click();
      cy.getByCy('outlined-variant-option').click();
      cy.getByCy('icon-field').click();
      cy.getByCy('settings-icon-option').click();
      cy.getByCy('button-text-clear-button').click();
      cy.getByCy('auto-close-checkbox').click();
      cy.getByCy('accent-button').click();
      verifySnackbarContainer();
      cy.getByCy('warn-button').click();
      verifySnackbarContainer();
    });
  });
}
