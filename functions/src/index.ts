import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { routesConfig } from './users/routes-config';
import { beforeUserCreated } from 'firebase-functions/v2/identity';

admin.initializeApp();
const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));
app.set('trust proxy', 1);
routesConfig(app);

export const api = functions.https.onRequest(app);
export const beforecreated = beforeUserCreated(() => {
  return {
    customClaims: {
      roles: ['user']
    }
  };
});
