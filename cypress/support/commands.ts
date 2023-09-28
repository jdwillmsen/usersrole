import { environment } from '../../src/environments/environment';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/firestore';

Cypress.Commands.add('getByCy', (selector: any, ...args: any[]) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});
Cypress.Commands.add('getToken', (email: string, password: string) => {
  return cy.request({
    method: 'POST',
    url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebase.apiKey}`,
    body: {
      returnSecureToken: true,
      clientType: 'CLIENT_TYPE_WEB',
      email,
      password
    }
  });
});

Cypress.Commands.add('deleteUser', (email: string) => {
  cy.fixture('accounts').then((accounts) => {
    cy.getToken(accounts.admin.email, accounts.admin.password).then((res) => {
      cy.request({
        method: 'GET',
        url: `${environment.functionsBaseUrl}/api/users`,
        headers: {
          authorization: `Bearer ${res.body.idToken}`
        }
      }).then((res) => {
        const uid = res.body.users.find((user: any) => {
          return user.email === email;
        })?.uid;

        if (uid) {
          cy.request({
            method: 'DELETE',
            url: `${environment.functionsBaseUrl}/api/users/${uid}`,
            headers: {
              authorization: res.requestHeaders['authorization']
            }
          });
        }
      });
    });
  });
});

Cypress.Commands.add('deleteNewUser', () => {
  cy.deleteUser('cicd-new-user-account@usersrole.com');
});

Cypress.Commands.add('login', (userType) => {
  cy.fixture('accounts').then((accounts) => {
    if (userType)
      cy.loginWithUser(accounts[userType].email, accounts[userType].password);
    else cy.loginWithUser(accounts.basic.email, accounts.basic.password);
  });
});

Cypress.Commands.add('loginWithUser', (email: string, password: string) => {
  const app = firebase.initializeApp(environment.firebase);
  app.auth().signInWithEmailAndPassword(email, password);
});
