describe('Admin', () => {
  before(() => {
    cy.deleteNewUser();
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.login('admin').then(() => cy.visit('/'));
  });

  after(() => {
    cy.deleteNewUser();
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
  });

  it('should be able to create, view, edit, and delete a user', () => {
    cy.wait(30000); // To Avoid Limiter On Endpoints
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
            'User Created Successfully'
          );
          cy.getByCy('close-button').click();
        });
      cy.getByCy('app-name').click();
      cy.getByCy('users-nav-item').click();
      cy.get(
        '[col-id="email"] > .ag-header-cell-comp-wrapper > .ag-cell-label-container > .ag-header-cell-menu-button > .ag-icon'
      )
        .click()
        .type(user.email);
      cy.getByCy('title').click();
      cy.wait(500); // wait for grid to sort
      cy.getByCy('view-button').click();
      cy.getByCy('email-address-field')
        .find('input')
        .should('contain.value', user.email);
      cy.getByCy('display-name-field')
        .find('input')
        .should('contain.value', user.displayName);
      cy.getByCy('roles-field').find('input').should('contain.value', 'User');
      cy.getByCy('close-button').click();
      cy.getByCy('edit-button').click();
      cy.getByCy('display-name-field').type(' Edited');
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
            'User Edited Successfully'
          );
          cy.getByCy('close-button').click();
        });
      cy.wait(30000); // To Avoid Limiter On Endpoints
      cy.getByCy('app-name').click();
      cy.getByCy('users-nav-item').click();
      cy.get(
        '[col-id="email"] > .ag-header-cell-comp-wrapper > .ag-cell-label-container > .ag-header-cell-menu-button > .ag-icon'
      )
        .click()
        .type(user.email);
      cy.getByCy('title').click();
      cy.wait(500); // wait for grid to sort
      cy.getByCy('delete-button').click();
      cy.getByCy('email-address-field')
        .find('input')
        .should('contain.value', user.email);
      cy.getByCy('display-name-field')
        .find('input')
        .should('contain.value', user.displayName + ' Edited');
      cy.getByCy('roles-field')
        .find('input')
        .should('contain.value', 'User, Read');
      cy.getByCy('save-button').click();
      cy.getByCy('snackbar-container')
        .should('be.visible')
        .within(() => {
          cy.getByCy('message').should(
            'contain.text',
            'User Deleted Successfully'
          );
          cy.getByCy('close-button').click();
        });
      cy.getByCy('app-name').click();
      cy.getByCy('users-nav-item').click();
      cy.get(
        '[col-id="email"] > .ag-header-cell-comp-wrapper > .ag-cell-label-container > .ag-header-cell-menu-button > .ag-icon'
      )
        .click()
        .type(user.email);
      cy.getByCy('title').click();
      cy.wait(500); // wait for grid to sort
      cy.getByCy('view-button').should('not.exist');
    });
  });

  it('should be able to assign a user a role', () => {
    cy.wait(30000); // To Avoid Limiter On Endpoints
    cy.createNewUser().then((res) => {
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
              'Roles Assigned Successfully'
            );
          });
      });
    });
  });
});
