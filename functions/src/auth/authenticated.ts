import { NextFunction, Request, Response } from 'express';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
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
    const decodedToken: DecodedIdToken = await getAuth().verifyIdToken(token);
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
