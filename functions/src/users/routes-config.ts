import { Application } from 'express';
import { remove, patch, get, all, create } from './controller';
import { isAuthenticated } from '../auth/authenticated';
import { isAuthorized } from '../auth/authorized';
import * as expressRateLimit from 'express-rate-limit';

export function routesConfig(app: Application) {
  const limiter = expressRateLimit.rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5,
    message: 'You cannot make any more request at the moment. Try again later'
  });
  const createLimiter = expressRateLimit.rateLimit({
    windowMs: 1 * 60 * 60 * 1000, // 1 hour
    max: 3,
    message: 'You have exceeded the account creation limit requests at this time. Try again later'
  });
  // creates user
  app.post('/users', createLimiter, create);
  // lists all users
  app.get('/users', limiter, [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'] }),
    all
  ]);
  // get :id user
  app.get('/users/:id', limiter, [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
    get
  ]);
  // updates :id user
  app.patch('/users/:id', limiter, [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
    patch
  ]);
  // deletes :id user
  app.delete('/users/:id', limiter, [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'] }),
    remove
  ]);
}
