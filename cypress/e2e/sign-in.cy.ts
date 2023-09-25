describe('Sign In', () => {
  before(() => {
    cy.fixture('accounts')
      .then((accounts) => {
        // @ts-ignore
        this.accounts = accounts;
      })
      .as('accounts');
  });

  beforeEach(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
  });

  after(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
  });

  it('should be able to sign in with basic account', () => {
    // @ts-ignore
    testSignIn(this.accounts.basic.email, this.accounts.basic.password);
  });

  it('should be able to sign in with read account', () => {
    // @ts-ignore
    testSignIn(this.accounts.read.email, this.accounts.read.password);
  });

  it('should be able to sign in with manager account', () => {
    // @ts-ignore
    testSignIn(this.accounts.manager.email, this.accounts.manager.password);
  });

  it('should be able to sign in with admin account', () => {
    // @ts-ignore
    testSignIn(this.accounts.admin.email, this.accounts.admin.password);
  });
});

function testSignIn(email: string, password: string) {
  cy.visit('/');
  cy.url().should('include', '/sign-in');
  login(email, password);
  cy.getByCy('snackbar-container')
    .should('be.visible')
    .within(() => {
      cy.getByCy('message').should('contain.text', 'Login Successful');
    });
  cy.url().should('include', '/home');
}

function login(email: string, password: string) {
  cy.getByCy('email-address-field').type(email);
  cy.getByCy('password-field').type(password);
  cy.getByCy('sign-in-button').click();
}
