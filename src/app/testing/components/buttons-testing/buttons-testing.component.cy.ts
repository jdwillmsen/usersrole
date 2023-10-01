import { ButtonsTestingComponent } from './buttons-testing.component';
import { ActivatedRoute } from '@angular/router';

describe('ButtonsTestingComponent', () => {
  beforeEach(() => {
    cy.mount(ButtonsTestingComponent, {
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    });
  });
  it('should mount', () => {
    console.log('Component mounted successfully');
  });

  it('should be setup properly', () => {
    checkButtonGroup('basic', 'Basic Buttons');
    checkButtonGroup('raised', 'Raised Buttons');
    checkButtonGroup('stroked', 'Stroked Buttons');
    checkButtonGroup('flat', 'Flat Buttons');
    checkIconButtons('icon', 'Icon Buttons');
    checkButtonGroup('fab', 'Fab Buttons');
    checkButtonGroup('mini-fab', 'Mini Fab Buttons');
  });
});

function checkButtonGroup(type: string, title: string) {
  cy.getByCy(`${type}-buttons-title`)
    .should('be.visible')
    .and('contain.text', title);
  cy.getByCy(`${type}-buttons-basic`)
    .should('be.visible')
    .and('contain.text', 'Basic')
    .and('be.enabled');
  cy.getByCy(`${type}-buttons-primary`)
    .should('be.visible')
    .and('contain.text', 'Primary')
    .and('be.enabled');
  cy.getByCy(`${type}-buttons-accent`)
    .should('be.visible')
    .and('contain.text', 'Accent')
    .and('be.enabled');
  cy.getByCy(`${type}-buttons-warn`)
    .should('be.visible')
    .and('contain.text', 'Warn')
    .and('be.enabled');
  cy.getByCy(`${type}-buttons-success`)
    .should('be.visible')
    .and('contain.text', 'Success')
    .and('be.enabled');
  cy.getByCy(`${type}-buttons-error`)
    .should('be.visible')
    .and('contain.text', 'Error')
    .and('be.enabled');
  cy.getByCy(`${type}-buttons-info`)
    .should('be.visible')
    .and('contain.text', 'Info')
    .and('be.enabled');
  cy.getByCy(`${type}-buttons-disabled`)
    .should('be.visible')
    .and('contain.text', 'Disabled')
    .and('not.be.enabled');
  cy.getByCy(`${type}-buttons-link`)
    .should('be.visible')
    .and('contain.text', 'Link');
}

function checkIconButtons(type: string, title: string) {
  cy.getByCy(`${type}-buttons-title`)
    .should('be.visible')
    .and('contain.text', title);
  cy.getByCy(`${type}-buttons-basic`).should('be.visible').and('be.enabled');
  cy.getByCy(`${type}-buttons-primary`).should('be.visible').and('be.enabled');
  cy.getByCy(`${type}-buttons-accent`).should('be.visible').and('be.enabled');
  cy.getByCy(`${type}-buttons-warn`).should('be.visible').and('be.enabled');
  cy.getByCy(`${type}-buttons-success`).should('be.visible').and('be.enabled');
  cy.getByCy(`${type}-buttons-error`).should('be.visible').and('be.enabled');
  cy.getByCy(`${type}-buttons-info`).should('be.visible').and('be.enabled');
  cy.getByCy(`${type}-buttons-disabled`)
    .should('be.visible')
    .should('not.be.enabled');
}
