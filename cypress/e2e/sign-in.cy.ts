describe('Default page testing', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.getByCy('navbar-header').should('be.visible');
    cy.getByCy('app-name').should('be.visible').and('have.text', 'Users Role');
    cy.getByCy('sidenav-container').should('be.visible');
    cy.getByCy('sidenav-content').should('be.visible');
  });
});
