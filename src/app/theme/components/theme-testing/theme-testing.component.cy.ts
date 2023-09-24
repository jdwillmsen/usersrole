import { ThemeTestingComponent } from './theme-testing.component';

describe('ThemeTestingComponent', () => {
  beforeEach(() => {
    cy.mount(ThemeTestingComponent);
  });

  it('should mount', () => {});

  it('should be setup properly', () => {
    cy.getByCy('primary-title')
      .should('be.visible')
      .and('contain.text', 'Primary');
    cy.getByCy('primary-palette').should('be.visible');
    cy.getByCy('accent-title')
      .should('be.visible')
      .and('contain.text', 'Accent');
    cy.getByCy('accent-palette').should('be.visible');
    cy.getByCy('success-title')
      .should('be.visible')
      .and('contain.text', 'Success');
    cy.getByCy('success-palette').should('be.visible');
    cy.getByCy('error-title').should('be.visible').and('contain.text', 'Error');
    cy.getByCy('error-palette').should('be.visible');
    cy.getByCy('info-title').should('be.visible').and('contain.text', 'Info');
    cy.getByCy('info-palette').should('be.visible');
    cy.getByCy('warn-title').should('be.visible').and('contain.text', 'Warn');
    cy.getByCy('warn-palette').should('be.visible');
  });
});
