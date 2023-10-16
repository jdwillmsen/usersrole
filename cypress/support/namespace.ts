type Role = 'basic' | 'read' | 'manager' | 'admin';
declare namespace Cypress {
  interface Chainable<Subject = any> {
    getByCy(selector: any, ...args: any[]): Cypress.Chainable<any>;

    getToken(email: string, password: string): Cypress.Chainable<any>;

    deleteUser(email: string): Cypress.Chainable<any>;

    deleteNewUser(id?: string): Cypress.Chainable<any>;

    deleteThemeUser(): Cypress.Chainable<any>;

    createUser(
      email: string,
      displayName: string,
      password: string,
      roles: Role[]
    ): Cypress.Chainable<any>;

    createNewUser(id?: string): Cypress.Chainable<any>;

    createThemeUser(): Cypress.Chainable<any>;

    loginWithUser(email: string, password: string): Cypress.Chainable<any>;

    login(userType?: Role): Cypress.Chainable<any>;

    changeColor(
      colorSelector: string,
      colorValue: string
    ): Cypress.Chainable<any>;

    setupAppCheck(): Cypress.Chainable<any>;

    clearFirebaseLocal(): Cypress.Chainable<any>;
  }
}
