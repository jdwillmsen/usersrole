import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { authState } from 'rxfire/auth';
import { map, take } from 'rxjs';
import { AUTH } from '../firebase.tokens';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AUTH);
  const router = inject(Router);
  return authState(auth).pipe(
    take(1),
    map((user) => (user ? true : router.createUrlTree(['login'])))
  );
};

export const unauthGuard: CanActivateFn = () => {
  const auth = inject(AUTH);
  const router = inject(Router);
  return authState(auth).pipe(
    take(1),
    map((user) => (user ? router.createUrlTree(['home']) : true))
  );
};
