import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { PermissionsService } from '../services/permissions/permissions.service';

export const RoleGuard: CanActivateFn = (next: ActivatedRouteSnapshot) => {
  return inject(PermissionsService).canActivateRole(next);
};
