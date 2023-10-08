import { GithubButtonComponent } from './github-button.component';

describe('GithubButtonComponent', () => {
  it('should mount', () => {
    cy.mount(GithubButtonComponent);
  });

  it('should be setup properly', () => {
    cy.mount(GithubButtonComponent);
    cy.getByCy('github-button-link').should('be.visible');
    cy.getByCy('github-button-icon').should('be.visible');
  });
});
