describe('Sign In', () => {
  before(() => {
    cy.setupAppCheck();
  });

  beforeEach(() => {
    cy.clearFirebaseLocal();
  });

  afterEach(() => {
    cy.clearFirebaseLocal();
  });

  after(() => {
    cy.clearFirebaseLocal();
  });

  it('should be able to sign in with basic account', () => {
    cy.clearFirebaseLocal().then(() => {
      cy.visit('/sign-in');
    });
    cy.fixture('accounts').then((accounts) => {
      testSignIn(accounts.basic.email, accounts.basic.password);
    });
  });

  it('should be able to sign in with read account', () => {
    cy.fixture('accounts').then((accounts) => {
      testSignIn(accounts.read.email, accounts.read.password);
    });
  });

  it('should be able to sign in with manager account', () => {
    cy.fixture('accounts').then((accounts) => {
      testSignIn(accounts.manager.email, accounts.manager.password);
    });
  });

  it('should be able to sign in with admin account', () => {
    cy.fixture('accounts').then((accounts) => {
      testSignIn(accounts.admin.email, accounts.admin.password);
    });
  });
});

function testSignIn(email: string, password: string) {
  cy.visit('/');
  cy.url().should('include', '/sign-in');
  login(email, password);
  cy.getByCy('snackbar-container')
    .should('be.visible')
    .within(() => {
      cy.getByCy('message').should('contain.text', 'Sign in successful');
    });
  cy.url().should('include', '/home');
}

function login(email: string, password: string) {
  cy.getByCy('email-address-field').type(email);
  cy.getByCy('password-field').type(password);
  cy.getByCy('sign-in-button').click();
}
