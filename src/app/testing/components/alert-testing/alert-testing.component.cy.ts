import { AlertTestingComponent } from './alert-testing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AlertTestingComponent', () => {
  beforeEach(() => {
    cy.mount(AlertTestingComponent, {
      imports: [BrowserAnimationsModule]
    });
  });

  it('should mount', () => {});

  testBreakpoint('XSmall Screen', 300, 600);
  testBreakpoint('Small Screen', 800, 800);
  testBreakpoint('Medium Screen', 1200, 800);
  testBreakpoint('Large Screen', 1600, 900);
  testBreakpoint('XLarge Screen', 2560, 1080);
});

function testAlert(alertButtonSelector: string, messageValue: string) {
  cy.getByCy(alertButtonSelector).click();
  cy.getByCy('message').should('be.visible').and('contain.text', messageValue);
}

function closeAlerts(amount = 1) {
  for (let count = 0; count < amount; count++)
    cy.getByCy('close-button').first().click();
}

function openDefaultAlerts() {
  cy.getByCy('default-primary-button').click();
  cy.getByCy('default-accent-button').click();
  cy.getByCy('default-info-button').click();
  cy.getByCy('default-error-button').click();
  cy.getByCy('default-success-button').click();
  cy.getByCy('default-warn-button').click();
}

function openOneAlerts() {
  cy.getByCy('one-primary-button').click();
  cy.getByCy('one-accent-button').click();
  cy.getByCy('one-info-button').click();
  cy.getByCy('one-error-button').click();
  cy.getByCy('one-success-button').click();
  cy.getByCy('one-warn-button').click();
}

function openTwoAlerts() {
  cy.getByCy('two-primary-button').click();
  cy.getByCy('two-accent-button').click();
  cy.getByCy('two-info-button').click();
  cy.getByCy('two-error-button').click();
  cy.getByCy('two-success-button').click();
  cy.getByCy('two-warn-button').click();
}

function testBreakpoint(name: string, width: number, height: number) {
  describe(name, () => {
    beforeEach(() => cy.viewport(width, height));
    it('should be setup properly', () => {
      cy.getByCy('default-title')
        .should('be.visible')
        .and('contain.text', 'Default');
      cy.getByCy('default-primary-button')
        .should('be.visible')
        .and('contain.text', 'Primary Alert')
        .and('be.enabled');
      cy.getByCy('default-accent-button')
        .should('be.visible')
        .and('contain.text', 'Accent Alert')
        .and('be.enabled');
      cy.getByCy('default-info-button')
        .should('be.visible')
        .and('contain.text', 'Info Alert')
        .and('be.enabled');
      cy.getByCy('default-error-button')
        .should('be.visible')
        .and('contain.text', 'Error Alert')
        .and('be.enabled');
      cy.getByCy('default-success-button')
        .should('be.visible')
        .and('contain.text', 'Success Alert')
        .and('be.enabled');
      cy.getByCy('default-warn-button')
        .should('be.visible')
        .and('contain.text', 'Warn Alert')
        .and('be.enabled');
      cy.getByCy('default-close-button')
        .should('be.visible')
        .and('contain.text', 'Close Alerts')
        .and('be.enabled');
      cy.getByCy('close-button-checkbox')
        .should('be.visible')
        .and('contain.text', 'Close Button')
        .find('input')
        .and('be.enabled')
        .and('be.checked');
      cy.getByCy('default-icons-checkbox')
        .should('be.visible')
        .and('contain.text', 'Default Icons')
        .find('input')
        .and('be.enabled')
        .and('not.be.checked');
      cy.getByCy('fade-checkbox')
        .should('be.visible')
        .and('contain.text', 'Fade')
        .find('input')
        .and('be.enabled')
        .and('not.be.checked');
      cy.getByCy('auto-close-checkbox')
        .should('be.visible')
        .and('contain.text', 'Auto Close')
        .find('input')
        .and('be.enabled')
        .and('not.be.checked');
      cy.getByCy('auto-close-time-field')
        .should('be.visible')
        .and('contain.text', 'Auto Close Time')
        .find('input')
        .should('contain.value', 3000);
      cy.getByCy('fade-time-field')
        .should('be.visible')
        .and('contain.text', 'Fade Time')
        .find('input')
        .should('contain.value', 500);
      cy.getByCy('icon-field').should('be.visible').and('contain.text', 'Icon');
      cy.getByCy('max-alerts-field')
        .should('be.visible')
        .and('contain.text', 'Max Alerts');
      cy.getByCy('variant-field')
        .should('be.visible')
        .and('contain.text', 'Variant');
      cy.getByCy('variant-select-value').should('contain.text', 'Default');
      cy.getByCy('default-alerts').should('not.be.visible');
      cy.getByCy('one-title').should('be.visible').and('contain.text', 'One');
      cy.getByCy('one-primary-button')
        .should('be.visible')
        .and('contain.text', 'Primary Alert')
        .and('be.enabled');
      cy.getByCy('one-accent-button')
        .should('be.visible')
        .and('contain.text', 'Accent Alert')
        .and('be.enabled');
      cy.getByCy('one-info-button')
        .should('be.visible')
        .and('contain.text', 'Info Alert')
        .and('be.enabled');
      cy.getByCy('one-error-button')
        .should('be.visible')
        .and('contain.text', 'Error Alert')
        .and('be.enabled');
      cy.getByCy('one-success-button')
        .should('be.visible')
        .and('contain.text', 'Success Alert')
        .and('be.enabled');
      cy.getByCy('one-warn-button')
        .should('be.visible')
        .and('contain.text', 'Warn Alert')
        .and('be.enabled');
      cy.getByCy('one-close-button')
        .should('be.visible')
        .and('contain.text', 'Close Alerts')
        .and('be.enabled');
      cy.getByCy('one-alerts').should('not.be.visible');
      cy.getByCy('two-title').should('be.visible').and('contain.text', 'Two');
      cy.getByCy('two-primary-button')
        .should('be.visible')
        .and('contain.text', 'Primary Alert')
        .and('be.enabled');
      cy.getByCy('two-accent-button')
        .should('be.visible')
        .and('contain.text', 'Accent Alert')
        .and('be.enabled');
      cy.getByCy('two-info-button')
        .should('be.visible')
        .and('contain.text', 'Info Alert')
        .and('be.enabled');
      cy.getByCy('two-error-button')
        .should('be.visible')
        .and('contain.text', 'Error Alert')
        .and('be.enabled');
      cy.getByCy('two-success-button')
        .should('be.visible')
        .and('contain.text', 'Success Alert')
        .and('be.enabled');
      cy.getByCy('two-warn-button')
        .should('be.visible')
        .and('contain.text', 'Warn Alert')
        .and('be.enabled');
      cy.getByCy('two-close-button')
        .should('be.visible')
        .and('contain.text', 'Close Alerts')
        .and('be.enabled');
      cy.getByCy('two-alerts').should('not.be.visible');
    });

    it('should show alerts when buttons pressed', () => {
      testAlert('default-primary-button', 'Primary Message');
      testAlert('default-accent-button', 'Accent Message');
      testAlert('default-info-button', 'Info Message');
      testAlert('default-error-button', 'Error Message');
      testAlert('default-success-button', 'Success Message');
      testAlert('default-warn-button', 'Warn Message');
      testAlert('one-primary-button', 'Primary Message');
      testAlert('one-accent-button', 'Accent Message');
      testAlert('one-info-button', 'Info Message');
      testAlert('one-error-button', 'Error Message');
      testAlert('one-success-button', 'Success Message');
      testAlert('one-warn-button', 'Warn Message');
      testAlert('two-primary-button', 'Primary Message');
      testAlert('two-accent-button', 'Accent Message');
      testAlert('two-info-button', 'Info Message');
      testAlert('two-error-button', 'Error Message');
      testAlert('two-success-button', 'Success Message');
      testAlert('two-warn-button', 'Warn Message');
      cy.getByCy('default-alerts').should('be.visible');
      cy.getByCy('one-alerts').should('be.visible');
      cy.getByCy('two-alerts').should('be.visible');
    });

    it('should close alerts when close button(s) pressed', () => {
      openDefaultAlerts();
      cy.getByCy('default-alerts').should('be.visible');
      closeAlerts(6);
      cy.getByCy('default-alerts').should('not.be.visible');
      openDefaultAlerts();
      cy.getByCy('default-alerts').should('be.visible');
      cy.getByCy('default-close-button').click();
      cy.getByCy('default-alerts').should('not.be.visible');
      openOneAlerts();
      cy.getByCy('one-alerts').should('be.visible');
      closeAlerts(6);
      cy.getByCy('one-alerts').should('not.be.visible');
      openOneAlerts();
      cy.getByCy('one-alerts').should('be.visible');
      cy.getByCy('one-close-button').click();
      cy.getByCy('one-alerts').should('not.be.visible');
      openTwoAlerts();
      cy.getByCy('two-alerts').should('be.visible');
      cy.getByCy('two-close-button').click();
      cy.getByCy('two-alerts').should('not.be.visible');
    });

    it('should behave appropriately when applying alert options', () => {
      cy.getByCy('close-button-checkbox').click();
      cy.getByCy('default-primary-button').click();
      cy.getByCy('close-button').should('not.be.visible');
      cy.getByCy('default-close-button').click();
      cy.getByCy('default-icons-checkbox').click();
      cy.getByCy('fade-checkbox').click();
      cy.getByCy('auto-close-checkbox').click();
      cy.getByCy('default-info-button').click();
      cy.getByCy('icon').should('be.visible');
      cy.getByCy('auto-close-time-field').type('{backspace}');
      cy.getByCy('fade-time-field').type('{backspace}');
      cy.getByCy('icon-field').click();
      cy.getByCy('none-icon-option').click();
      cy.getByCy('icon-field').should('not.have.value').click();
      cy.getByCy('settings-icon-option').click();
      cy.getByCy('max-alerts-field').type('1');
      cy.getByCy('variant-field').click();
      cy.getByCy('filled-variant-option').click();
      cy.getByCy('default-accent-button').click();
      cy.getByCy('icon').should('be.visible');
      cy.getByCy('message').should('be.visible');
      cy.getByCy('default-alerts').should('not.be.visible');
    });
  });
}
