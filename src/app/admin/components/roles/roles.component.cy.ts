import { RolesComponent } from './roles.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RolesComponent', () => {
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
    cy.mount(RolesComponent, {
      imports: [HttpClientModule, MatSnackBarModule, BrowserAnimationsModule]
    });
  });

  it('should be setup correctly', () => {
    cy.mount(RolesComponent, {
      imports: [HttpClientModule, MatSnackBarModule, BrowserAnimationsModule]
    });
    cy.getByCy('title').should('be.visible').and('have.text', 'Roles');
    cy.getByCy('select-user-field')
      .should('be.visible')
      .and('have.text', 'Select User');
    cy.getByCy('select-roles-field')
      .should('be.visible')
      .and('have.text', 'Roles');
    cy.getByCy('assign-roles-button')
      .should('be.visible')
      .and('contain.text', 'Assign Roles')
      .and('be.disabled');
    cy.getByCy('resetButton')
      .should('be.visible')
      .and('contain.text', 'Reset')
      .and('be.enabled');
  });

  it('should have error messages after touched form', () => {
    cy.mount(RolesComponent, {
      imports: [HttpClientModule, MatSnackBarModule, BrowserAnimationsModule]
    });
    cy.getByCy('select-user-field').click();
    cy.getByCy('title').click();
    cy.getByCy('select-roles-field').click();
    cy.get('.cdk-overlay-backdrop').click({ force: true });
    cy.getByCy('assign-roles-button').should('be.disabled');
    cy.getByCy('select-user-field').contains(
      'Please select a user from the list'
    );
    cy.getByCy('select-roles-field').contains(
      'At least one role must be selected'
    );
  });

  it('should populate roles field when user is selected', () => {
    cy.mount(RolesComponent, {
      imports: [HttpClientModule, MatSnackBarModule, BrowserAnimationsModule]
    });
    cy.getByCy('select-user-field')
      .type('Basic Test User #1{enter}')
      .get('input')
      .should('contain.value', 'Basic Test User #1 (test-uid-1)');
    cy.getByCy('select-roles-field').should('contain.text', 'User');
    cy.getByCy('matchingRolesError')
      .should('be.visible')
      .and('contain.text', 'The user already has these roles');
    cy.getByCy('assign-roles-button').should('be.disabled');
  });

  it.only('should assign roles correctly', () => {
    cy.intercept(
      {
        method: 'PATCH',
        url: '/api/users/roles/**'
      },
      ''
    ).as('assignRoles');
    cy.mount(RolesComponent, {
      imports: [HttpClientModule, MatSnackBarModule, BrowserAnimationsModule]
    });
    cy.getByCy('select-user-field').type('Basic Test User #1{enter}');
    cy.getByCy('select-roles-field').click();
    cy.get('#mat-option-3').click();
    cy.get('.cdk-overlay-backdrop').click({ force: true });
    cy.getByCy('select-roles-field').should('contain.text', 'User, Read');
    cy.getByCy('assign-roles-button').should('be.enabled').click();
    cy.get('.snackbar-container')
      .should('be.visible')
      .and('contain.text', 'Roles Assigned Successfully');
    cy.getByCy('resetButton').click();
    cy.getByCy('assign-roles-button').should('be.disabled');
    cy.getByCy('select-user-field').get('input').should('have.value', '');
    cy.getByCy('select-roles-field').get('input').should('have.value', '');
    cy.getByCy('select-user-field').type('All Test User #1{enter}');
    cy.getByCy('select-roles-field')
      .should('contain.text', 'Admin, Manager, User, Read')
      .click();
    cy.get('#mat-option-0').click();
    cy.get('#mat-option-1').click();
    cy.get('#mat-option-3').click();
    cy.get('.cdk-overlay-backdrop').click({ force: true });
    cy.getByCy('assign-roles-button').should('be.enabled').click();
    cy.get('.snackbar-container')
      .should('be.visible')
      .and('contain.text', 'Roles Assigned Successfully');
  });
});
