import { RolesService, UpdateUserRolesRequest } from './roles.service';
import { expect } from '@jest/globals';
import { environment } from '../../../../environments/environment';
import { EMPTY, throwError } from 'rxjs';

describe('RolesService', () => {
  let rolesService: RolesService;
  const httpClientMock: jest.Mocked<any> = {
    patch: jest.fn()
  };
  const snackbarServiceMock: jest.Mocked<any> = {
    error: jest.fn()
  };
  const baseUrl = `${environment.functionsBaseUrl}/api/users`;

  beforeEach(() => {
    rolesService = new RolesService(httpClientMock, snackbarServiceMock);
  });

  it('should create an instance of RolesService', () => {
    expect(rolesService).toBeInstanceOf(RolesService);
  });

  it('should send a update request and return nothing on success', () => {
    const user: UpdateUserRolesRequest = {
      uid: 'uid1',
      roles: ['user']
    };
    const url = `${baseUrl}/roles/${user.uid}`;
    jest.spyOn(httpClientMock, 'patch').mockReturnValue(EMPTY);

    rolesService.update(user).subscribe((result) => {
      expect(result).toBe(EMPTY);
      expect(httpClientMock.patch).toBeCalledTimes(1);
      expect(httpClientMock.patch).toHaveBeenCalledWith(url, user);
      expect(snackbarServiceMock.error).not.toHaveBeenCalled();
    });
  });

  it('should handle errors by showing a snackbar error message and returning nothing', () => {
    const user: UpdateUserRolesRequest = {
      uid: 'uid1',
      roles: ['user']
    };
    const errorResponse = { error: 'User does not have proper permissions' };
    const url = `${baseUrl}/roles/${user.uid}`;
    jest
      .spyOn(httpClientMock, 'patch')
      .mockReturnValue(throwError(() => errorResponse));

    rolesService.update(user).subscribe((result) => {
      expect(result).toBe(EMPTY);
      expect(httpClientMock.patch).toBeCalledTimes(1);
      expect(httpClientMock.patch).toHaveBeenCalledWith(url, user);
      expect(snackbarServiceMock.error).toBeCalledTimes(1);
      expect(snackbarServiceMock.error).toHaveBeenCalledWith(
        errorResponse.error,
        { variant: 'filled' },
        true
      );
    });
  });
});
