describe('Admin', () => {
  beforeEach(() => {
    cy.deleteNewUser();
    cy.login('admin').then(() => cy.visit('/'));
  });

  after(() => {
    cy.deleteNewUser();
    cy.clearFirebaseLocal();
  });

  describe('Users', () => {
    it('should be able to create a user', () => {
      cy.fixture('new-user').then((user) => {
        cy.visit('/admin/users');
        cy.getByCy('create-user-button').click();
        cy.getByCy('email-address-field').type(user.email);
        cy.getByCy('display-name-field').type(user.displayName);
        cy.getByCy('roles-field').click();
        cy.getByCy('user-role-option').click();
        cy.get('.cdk-overlay-transparent-backdrop').click({ force: true });
        cy.getByCy('password-field').type(user.password);
        cy.getByCy('confirm-password-field').type(user.password);
        cy.getByCy('save-button').click();
        cy.getByCy('snackbar-container')
          .should('be.visible')
          .within(() => {
            cy.getByCy('message').should(
              'contain.text',
              'User created successfully'
            );
            cy.getByCy('close-button').click();
          });
      });
    });

    it('should be able to view a user', () => {
      cy.createNewUser();
      cy.visit('/admin/users');
      cy.fixture('new-user').then((user) => {
        filterEmail(user.email);
        cy.getByCy('view-button').first().click();
        cy.getByCy('email-address-field')
          .find('input')
          .should('contain.value', user.email);
        cy.getByCy('display-name-field')
          .find('input')
          .should('contain.value', user.displayName);
        cy.getByCy('roles-field').find('input').should('contain.value', 'User');
        cy.getByCy('close-button').click();
        cy.getByCy('title').should('be.visible');
      });
    });

    it('should be able to edit a user', () => {
      cy.createNewUser();
      cy.visit('/admin/users');
      cy.fixture('new-user').then((user) => {
        filterEmail(user.email);
        cy.getByCy('edit-button').first().click();
        cy.getByCy('display-name-field').should('be.visible').type(' Edited');
        cy.getByCy('roles-field').click();
        cy.getByCy('read-role-option').click();
        cy.get('.cdk-overlay-transparent-backdrop').click({ force: true });
        cy.getByCy('password-field').type(user.password);
        cy.getByCy('confirm-password-field').type(user.password);
        cy.getByCy('save-button').click();
        cy.getByCy('snackbar-container')
          .should('be.visible')
          .within(() => {
            cy.getByCy('message').should(
              'contain.text',
              'User edited successfully'
            );
            cy.getByCy('close-button').click();
          });
        cy.getByCy('app-name').click();
        cy.getByCy('users-nav-item').click();
        filterEmail(user.email);
        cy.contains('CICD New User Edited');
      });
    });

    it('should be able to delete a user', () => {
      cy.createNewUser();
      cy.visit('/admin/users');
      cy.fixture('new-user').then((user) => {
        filterEmail(user.email);
        cy.getByCy('delete-button').first().click();
        cy.getByCy('email-address-field')
          .find('input')
          .should('contain.value', user.email);
        cy.getByCy('display-name-field')
          .find('input')
          .should('contain.value', user.displayName);
        cy.getByCy('roles-field').find('input').should('contain.value', 'User');
        cy.getByCy('save-button').click();
        cy.getByCy('snackbar-container')
          .should('be.visible')
          .within(() => {
            cy.getByCy('message').should(
              'contain.text',
              'User deleted successfully'
            );
            cy.getByCy('close-button').click();
          });
        cy.getByCy('app-name').click();
        cy.getByCy('users-nav-item').click();
        filterEmail(user.email);
        cy.getByCy('view-button').should('not.exist');
      });
    });
  });

  describe('Roles', () => {
    after(() => {
      cy.deleteNewUser('roles-');
    });
    it('should be able to assign a user a role', () => {
      cy.createNewUser('roles-').then((res) => {
        cy.fixture('new-user').then((user) => {
          cy.visit('/admin/roles');
          cy.getByCy('select-user-field').type(user.displayName);
          cy.contains(res.body.uid).click();
          cy.getByCy('select-roles-field').click();
          cy.getByCy('read-role-option').click();
          cy.get('.cdk-overlay-backdrop').click({ force: true });
          cy.getByCy('assign-roles-button').click();
          cy.getByCy('snackbar-container')
            .should('be.visible')
            .within(() => {
              cy.getByCy('message').should(
                'contain.text',
                'Roles assigned successfully'
              );
            });
        });
      });
    });
  });
});

const filterEmail = (email: string) => {
  cy.get('[col-id="email"] .ag-icon').first().click();
  cy.get('.ag-filter-filter').first().type(email);
  cy.getByCy('title').click();
  cy.wait(500); // wait for grid to sort
};
