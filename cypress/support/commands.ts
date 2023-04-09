declare namespace Cypress {
  interface Chainable<Subject = any> {
    getByCy(selector: any, ...args: any[]): Cypress.Chainable<any>;
  }
}

Cypress.Commands.add('getByCy', (selector: any, ...args: any[]) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});
