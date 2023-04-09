describe('Default page testing', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.getByCy('navbar-header').should('be.visible');
    cy.getByCy('app-name').should('be.visible').and('have.text', 'My App');
    cy.getByCy('sidenav-container').should('be.visible');
    cy.getByCy('sidenav-links').should('be.visible');
    cy.getByCy('sidenav-content').should('be.visible');
    cy.getByCy('sidenav-links-list').should('not.be.empty');
    cy.getByCy('expand-toggle-button').click();
    cy.getByCy('sidenav-links-list').contains('Home');
    cy.getByCy('expand-toggle-button').click();
  });
});
