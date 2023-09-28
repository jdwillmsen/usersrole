describe('Sign Up', () => {
  beforeEach(() => {
    cy.deleteNewUser();
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
  });

  it('should be able to sign up a new user', () => {
    cy.fixture('new-user').then((user) => {
      cy.visit('/sign-up');
      cy.url().should('include', '/sign-up');
      cy.getByCy('email-address-field').type(user.email);
      cy.getByCy('display-name-field').type(user.displayName);
      cy.getByCy('password-field').type(user.password);
      cy.getByCy('confirm-password-field').type(user.password);
      cy.getByCy('sign-up-button').click();
      cy.getByCy('snackbar-container')
        .should('be.visible')
        .within(() => {
          cy.getByCy('message').should('contain.text', 'Sign Up Successful');
        });
      cy.url().should('include', '/sign-in');
    });
  });
});
