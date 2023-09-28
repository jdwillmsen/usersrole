declare namespace Cypress {
  interface Chainable<Subject = any> {
    getByCy(selector: any, ...args: any[]): Cypress.Chainable<any>;

    getToken(email: string, password: string): Cypress.Chainable<any>;

    deleteUser(email: string): Cypress.Chainable<any>;

    deleteNewUser(): Cypress.Chainable<any>;

    loginWithUser(email: string, password: string): Cypress.Chainable<any>;

    login(
      userType?: 'basic' | 'read' | 'manager' | 'admin'
    ): Cypress.Chainable<any>;
  }
}
