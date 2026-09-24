import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { initializeApp } from 'firebase-admin/app';
import { onRequest } from 'firebase-functions/v2/https';
import { beforeUserCreated, HttpsError } from 'firebase-functions/v2/identity';
import { routesConfig } from './users/routes-config';
import { isEmailAllowed, signupAllowlist } from './auth/signup-allowlist';

initializeApp();
const app = express();
app.use(bodyParser.json());
// The API authenticates with a Bearer ID token, not cookies, so CORS is not
// the access control here -- it only stops arbitrary sites from calling the
// API from a visitor's browser. localhost stays allowed because local
// development and the Cypress e2e suite both drive the deployed API from
// http://localhost:4200; preview channels are usersrole--<channel>.web.app.
const allowedOrigins: (string | RegExp)[] = [
  'https://usersrole.web.app',
  'https://usersrole.firebaseapp.com',
  /^https:\/\/usersrole--[a-z0-9-]+\.web\.app$/,
  'http://localhost:4200'
];
app.use(cors({ origin: allowedOrigins }));
app.set('trust proxy', 1);
routesConfig(app);

export const api = onRequest(app);
// Covers sign-ups made from the browser, i.e. the Google, GitHub and Twitter
// popups. Accounts made through the Admin SDK skip blocking functions, which
// is why the public POST /users route checks the same allowlist itself.
export const beforecreated = beforeUserCreated((event) => {
  if (!isEmailAllowed(event.data?.email, signupAllowlist.value())) {
    throw new HttpsError('permission-denied', 'Sign-up is closed.');
  }
  return {
    customClaims: {
      roles: ['user']
    }
  };
});
