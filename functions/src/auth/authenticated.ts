import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

export async function isAuthenticated(
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/ban-types
  next: Function
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  if (!authorization.startsWith('Bearer')) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  const split = authorization.split('Bearer ');
  if (split.length !== 2) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  const token = split[1];

  try {
    const decodedToken: admin.auth.DecodedIdToken = await admin
      .auth()
      .verifyIdToken(token);
    console.log('decodedToken', JSON.stringify(decodedToken));
    res.locals = {
      ...res.locals,
      uid: decodedToken.uid,
      roles: decodedToken.roles,
      email: decodedToken.email
    };
    return next();
  } catch (err: any) {
    console.error(`${err.code} - ${err.message}`);
    return res.status(401).send({ message: 'Unauthorized' });
  }
}
