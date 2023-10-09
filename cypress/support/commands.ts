import { environment } from '../../src/environments/environment';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/app-check';
import ReCaptchaV3Provider = firebase.appCheck.ReCaptchaV3Provider;

Cypress.Commands.add('getByCy', (selector: any, ...args: any[]) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});

Cypress.Commands.add('getToken', (email: string, password: string) => {
  cy.setupAppCheck().then((res) => {
    return cy.request({
      method: 'POST',
      url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebase.apiKey}`,
      body: {
        returnSecureToken: true,
        clientType: 'CLIENT_TYPE_WEB',
        email,
        password
      },
      headers: {
        'X-Firebase-Appcheck': res.appCheck.token
      }
    });
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
  cy.fixture('new-user').then((user) => {
    cy.deleteUser(user.email);
  });
});

Cypress.Commands.add('deleteThemeUser', () => {
  cy.fixture('theme-user').then((user) => {
    cy.deleteUser(user.email);
  });
});

Cypress.Commands.add(
  'createUser',
  (email: string, displayName: string, password: string, roles) => {
    cy.fixture('accounts').then((accounts) => {
      cy.getToken(accounts.admin.email, accounts.admin.password).then((res) => {
        return cy.request({
          method: 'POST',
          url: `${environment.functionsBaseUrl}/api/users/admin`,
          headers: {
            authorization: `Bearer ${res.body.idToken}`
          },
          body: {
            email,
            displayName,
            password,
            roles
          }
        });
      });
    });
  }
);

Cypress.Commands.add('createNewUser', () => {
  cy.fixture('new-user').then((user) => {
    cy.deleteNewUser().then(() => {
      return cy.createUser(
        user.email,
        user.displayName,
        user.password,
        user.roles
      );
    });
  });
});

Cypress.Commands.add('createThemeUser', () => {
  cy.fixture('theme-user').then((user) => {
    cy.deleteThemeUser().then(() => {
      return cy.createUser(
        user.email,
        user.displayName,
        user.password,
        user.roles
      );
    });
  });
});

Cypress.Commands.add('login', (userType) => {
  cy.fixture('accounts').then((accounts) => {
    if (userType)
      cy.loginWithUser(accounts[userType].email, accounts[userType].password);
    else cy.loginWithUser(accounts.basic.email, accounts.basic.password);
  });
});

Cypress.Commands.add('loginWithUser', (email: string, password: string) => {
  cy.setupAppCheck().then((res) => {
    res.app.auth().signInWithEmailAndPassword(email, password);
  });
});

Cypress.Commands.add(
  'changeColor',
  (colorSelector: string, colorValue: string) => {
    cy.getByCy(colorSelector)
      .click()
      .invoke('val', colorValue.toLowerCase())
      .trigger('input')
      .blur();
  }
);

Cypress.Commands.add('setupAppCheck', () => {
  // @ts-ignore
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = environment.appCheckDebugToken;
  const app = firebase.initializeApp(environment.firebase);
  const appCheck = firebase.appCheck();
  appCheck.activate(new ReCaptchaV3Provider(environment.recaptcha.siteKey));
  appCheck.setTokenAutoRefreshEnabled(true);
  return cy.wrap(
    appCheck.getToken().then((res) => ({ app: app, appCheck: res }))
  );
});

Cypress.Commands.add('clearFirebaseLocal', () => {
  cy.log('Clearing firebase local database');
  new Cypress.Promise(async (resolve) => {
    const req = indexedDB.deleteDatabase('firebaseLocalStorageDb');
    req.onsuccess = function () {
      resolve();
    };
  });
});
