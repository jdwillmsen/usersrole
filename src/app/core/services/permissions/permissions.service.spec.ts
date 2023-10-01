import { PermissionsService } from './permissions.service';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';
import { Role } from '../../models/users.model';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('PermissionsService', () => {
  let permissionsService: PermissionsService;
  let angularFireAuthMock: jest.Mocked<any>;
  const routerMock: jest.Mocked<any> = {
    navigate: jest.fn()
  };
  const usersServiceMock: jest.Mocked<any> = {
    user$: jest.fn()
  };
  const snackbarServiceMock: jest.Mocked<any> = {
    error: jest.fn()
  };

  beforeEach(() => {
    angularFireAuthMock = {
      user: of(null)
    };
    permissionsService = new PermissionsService(
      routerMock,
      usersServiceMock,
      angularFireAuthMock,
      snackbarServiceMock
    );
  });

  it('should create an instance of PermissionsService', () => {
    expect(permissionsService).toBeInstanceOf(PermissionsService);
  });

  it('should canActivateRole when user is null', (done) => {
    const roles: Role[] = ['read', 'user'];
    const next: ActivatedRouteSnapshot = {
      data: { roles }
    } as any;
    const userDetails = { roles };
    usersServiceMock.user$.mockReturnValue(of(userDetails));

    permissionsService.canActivateRole(next).subscribe((result) => {
      expect(result).toBeFalsy();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should canActivateRole when user has required roles', (done) => {
    const roles: Role[] = ['admin', 'user'];
    const next: ActivatedRouteSnapshot = {
      data: { roles }
    } as any;
    const userDetails = { roles: ['admin', 'user'] };
    angularFireAuthMock.user = of({ uid: 'testUser' });
    usersServiceMock.user$.mockReturnValue(of(userDetails));

    permissionsService.canActivateRole(next).subscribe((result) => {
      expect(result).toBeTruthy();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should canActivateRole when user does not have required roles', (done) => {
    const roles: Role[] = ['admin', 'manager'];
    const next: ActivatedRouteSnapshot = {
      data: { roles }
    } as any;
    const userDetails = { roles: ['users'] };
    angularFireAuthMock.user = of({ uid: 'testUser' });
    usersServiceMock.user$.mockReturnValue(of(userDetails));

    permissionsService.canActivateRole(next).subscribe((result) => {
      expect(result).toBeFalsy();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/forbidden']);
      done();
    });
  });

  it('should return true when user has the required role', () => {
    permissionsService.roles = ['admin', 'user'];

    const hasRole = permissionsService.hasRole(['admin']);

    expect(hasRole).toBeTruthy();
  });

  it('should return false when user does not have the required role', () => {
    permissionsService.roles = ['user'];

    const hasRole = permissionsService.hasRole(['admin']);

    expect(hasRole).toBeFalsy();
  });

  it('should return true when user has multiple required roles', () => {
    permissionsService.roles = ['admin', 'user', 'manager'];

    const hasRole = permissionsService.hasRole(['admin', 'manager']);

    expect(hasRole).toBeTruthy();
  });

  it('should return true when user has all required roles', () => {
    permissionsService.roles = ['admin', 'user', 'manager', 'read'];

    const hasRole = permissionsService.hasRole([
      'admin',
      'user',
      'manager',
      'read'
    ]);

    expect(hasRole).toBeTruthy();
  });

  it('should update roles when user is not null', (done) => {
    const user = { uid: 'testUser' };
    const userRoles: Role[] = ['admin', 'user'];
    angularFireAuthMock.user = of(user);
    usersServiceMock.user$.mockReturnValue(of({ roles: userRoles }));

    permissionsService.getRole();

    setTimeout(() => {
      expect(usersServiceMock.user$).toHaveBeenCalledWith(user.uid);
      expect(permissionsService.roles).toEqual(userRoles);
      done();
    }, 0);
  });

  it('should handle error when user retrieval fails', (done) => {
    const errorMessage = 'User retrieval error';
    angularFireAuthMock.user = throwError(() => {
      return { message: errorMessage };
    });

    permissionsService.getRole();

    setTimeout(() => {
      expect(snackbarServiceMock.error).toHaveBeenCalledWith(
        errorMessage,
        { variant: 'filled' },
        true
      );
      done();
    }, 0);
  });
});
