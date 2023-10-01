import { RolesCellRendererComponent } from './roles-cell-renderer.component';

describe('RolesCellRendererComponent', () => {
  it('should mount', () => {
    cy.mount(RolesCellRendererComponent);
  });

  it('should show multiple roles', () => {
    cy.mount(RolesCellRendererComponent, {
      componentProperties: {
        roles: ['user', 'read', 'manager', 'admin']
      }
    });
    cy.getByCy('role-chip').should('have.length', 4).and('be.visible');
    cy.contains('USER');
    cy.contains('READ');
    cy.contains('MANAGER');
    cy.contains('ADMIN');
  });
});
