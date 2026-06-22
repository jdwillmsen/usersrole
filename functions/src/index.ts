import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { initializeApp } from 'firebase-admin/app';
import { onRequest } from 'firebase-functions/v2/https';
import { beforeUserCreated } from 'firebase-functions/v2/identity';
import { routesConfig } from './users/routes-config';

initializeApp();
const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));
app.set('trust proxy', 1);
routesConfig(app);

export const api = onRequest(app);
export const beforecreated = beforeUserCreated(() => {
  return {
    customClaims: {
      roles: ['user']
    }
  };
});
