import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as expressRateLimit from 'express-rate-limit';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { routesConfig } from './users/routes-config';

const limiter = expressRateLimit.rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5
});

admin.initializeApp();
const app = express();
app.use(limiter);
app.use(bodyParser.json());
app.use(cors({ origin: true }));
routesConfig(app);

export const api = functions.https.onRequest(app);
