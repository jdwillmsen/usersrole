import { UsersComponent } from './users.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UsersComponent', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/users'
      },
      {
        fixture: 'users.json'
      }
    ).as('getUsers');
  });

  it('should mount', () => {
    cy.mount(UsersComponent, {
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        MatDialogModule,
        BrowserAnimationsModule
      ]
    });
  });

  it('should be setup properly', () => {
    cy.mount(UsersComponent, {
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        MatDialogModule,
        BrowserAnimationsModule
      ]
    });
    cy.getByCy('title').should('be.visible').and('contain.text', 'Users');
    cy.getByCy('create-user-button')
      .should('be.visible')
      .and('contain.text', 'Create User');
    cy.get('.ag-header-row > [col-id="uid"]')
      .should('be.visible')
      .and('contain.text', 'Uid');
    cy.get('.ag-header-row > [col-id="email"]')
      .should('be.visible')
      .and('contain.text', 'Email');
    cy.get('.ag-header-row > [col-id="displayName"]')
      .should('be.visible')
      .and('contain.text', 'Display Name');
    cy.get('.ag-header-row > [col-id="roles"]')
      .should('be.visible')
      .and('contain.text', 'Roles');
    cy.get('.ag-header-row > [col-id="lastSignInTime"]')
      .should('be.visible')
      .and('contain.text', 'Last Sign In Time');
    cy.get('.ag-header-row > [col-id="creationTime"]')
      .should('be.visible')
      .and('contain.text', 'Creation Time');
    cy.get('.ag-header-row > [col-id="actions"]')
      .should('be.visible')
      .and('contain.text', 'Actions');
    cy.contains('test-uid-1');
    cy.contains('test-user-1@usersrole.com');
    cy.contains('Basic Test User #1');
    cy.contains('User');
    cy.contains('Thu, 31 Aug 2023 05:34:14 GMT');
    cy.contains('Thu, 31 Aug 2023 05:26:17 GMT');
  });

  it('should create a user properly', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/api/users/admin'
      },
      '{"uid":"test-uid"}'
    ).as('getUsers');
    cy.mount(UsersComponent, {
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        MatDialogModule,
        BrowserAnimationsModule
      ]
    });
    cy.getByCy('create-user-button').click();
    cy.getByCy('email-address-field').type(
      'admin-create-user-test@usersrole.com'
    );
    cy.getByCy('display-name-field').type('Admin Create User Test');
    cy.getByCy('roles-field').click();
    cy.getByCy('user-role-option').click();
    cy.get('.cdk-overlay-transparent-backdrop').click({ force: true });
    cy.getByCy('password-field').type('testPassword');
    cy.getByCy('confirm-password-field').type('testPassword');
    cy.getByCy('save-button').click();
    cy.getByCy('snackbar-container')
      .should('be.visible')
      .and('contain.text', 'User Created Successfully');
  });

  it('should view a user properly', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/users/*'
      },
      '{"uid":"test-uid"}'
    ).as('getUsers');
    cy.mount(UsersComponent, {
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        MatDialogModule,
        BrowserAnimationsModule
      ]
    });
    cy.get(
      '[col-id="email"] > .ag-header-cell-comp-wrapper > .ag-cell-label-container > .ag-header-cell-menu-button > .ag-icon'
    )
      .click()
      .type('test-user-1@usersrole.com');
    cy.getByCy('title').click();
    cy.getByCy('view-button').first().click();
    cy.getByCy('email-address-field')
      .find('input')
      .should('contain.value', 'test-user-1@usersrole.com');
    cy.getByCy('display-name-field')
      .find('input')
      .should('contain.value', 'Basic Test User #1');
    cy.getByCy('roles-field').find('input').should('contain.value', 'User');
    cy.getByCy('uid-field').find('input').should('contain.value', 'test-uid-1');
    cy.getByCy('last-sign-in-time-field')
      .find('input')
      .should('contain.value', '');
    cy.getByCy('account-creation-time-field')
      .find('input')
      .should('contain.value', 'Sun, 23 Jul 2023 20:36:56 GMT');
    cy.getByCy('close-button').click();
    cy.getByCy('title').should('be.visible');
  });

  it('should edit a user properly', () => {
    cy.intercept(
      {
        method: 'PATCH',
        url: '/api/users/*'
      },
      ''
    ).as('getUsers');
    cy.mount(UsersComponent, {
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        MatDialogModule,
        BrowserAnimationsModule
      ]
    });
    cy.get(
      '[col-id="email"] > .ag-header-cell-comp-wrapper > .ag-cell-label-container > .ag-header-cell-menu-button > .ag-icon'
    )
      .click()
      .type('test-user-1@usersrole.com');
    cy.getByCy('title').click();
    cy.getByCy('edit-button').first().click();
    cy.wait(500); // CI issues with click correct field
    cy.getByCy('email-address-field')
      .find('input')
      .should('contain.value', 'test-user-1@usersrole.com')
      .type('edited-');
    cy.getByCy('display-name-field')
      .find('input')
      .should('contain.value', 'Basic Test User #1')
      .type('Edited ');
    cy.getByCy('roles-field').should('contain.text', 'User').click();
    cy.getByCy('read-role-option').click();
    cy.get('.cdk-overlay-transparent-backdrop').click({ force: true });
    cy.getByCy('password-field')
      .find('input')
      .should('have.value', '')
      .type('testPassword');
    cy.getByCy('confirm-password-field')
      .find('input')
      .should('have.value', '')
      .type('testPassword', { force: true });
    cy.getByCy('save-button').click();
    cy.getByCy('snackbar-container')
      .should('be.visible')
      .and('contain.text', 'User Edited Successfully');
  });
  it('should delete a user properly', () => {
    cy.intercept(
      {
        method: 'DELETE',
        url: '/api/users/*'
      },
      ''
    ).as('getUsers');
    cy.mount(UsersComponent, {
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        MatDialogModule,
        BrowserAnimationsModule
      ]
    });
    cy.get(
      '[col-id="email"] > .ag-header-cell-comp-wrapper > .ag-cell-label-container > .ag-header-cell-menu-button > .ag-icon'
    )
      .click()
      .type('test-user-1@usersrole.com');
    cy.getByCy('title').click();
    cy.getByCy('delete-button').first().click();
    cy.getByCy('email-address-field')
      .find('input')
      .should('contain.value', 'test-user-1@usersrole.com');
    cy.getByCy('display-name-field')
      .find('input')
      .should('contain.value', 'Basic Test User #1');
    cy.getByCy('roles-field').find('input').should('contain.value', 'User');
    cy.getByCy('uid-field').find('input').should('contain.value', 'test-uid-1');
    cy.getByCy('last-sign-in-time-field')
      .find('input')
      .should('contain.value', '');
    cy.getByCy('account-creation-time-field')
      .find('input')
      .should('contain.value', 'Sun, 23 Jul 2023 20:36:56 GMT');
    cy.getByCy('save-button').click();
    cy.getByCy('snackbar-container')
      .should('be.visible')
      .and('contain.text', 'User Deleted Successfully');
  });
});
