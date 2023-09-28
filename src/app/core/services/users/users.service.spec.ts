import { expect } from '@jest/globals';
import {
  CreateUserRequest,
  DeleteUserRequest,
  UpdateUserRequest,
  UsersService
} from './users.service';
import { User } from '../../models/users.model';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('UsersService', () => {
  let usersService: UsersService;
  const httpClientMock: jest.Mocked<any> = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn()
  };
  const snackbarServiceMock: jest.Mocked<any> = {
    error: jest.fn()
  };
  const testUser1: User = {
    uid: 'testUid1',
    displayName: 'testDisplayName1',
    roles: ['user'],
    email: 'tester1@usersrole.com'
  };
  const testUser2: User = {
    uid: 'testUid2',
    displayName: 'testDisplayName2',
    roles: ['user', 'read'],
    email: 'tester1@usersrole.com'
  };
  const testUser3: User = {
    uid: 'testUid3',
    displayName: 'testDisplayName3',
    roles: ['user', 'admin'],
    email: 'tester1@usersrole.com'
  };
  const defaultErrorMessage = 'An error occurred';
  const defaultErrorResponse = new HttpErrorResponse({
    error: defaultErrorMessage
  });
  const defaultCreateUser: CreateUserRequest = {
    displayName: 'Test User',
    password: 'testPassword',
    email: 'testUser1@usersrole.com',
    roles: ['user']
  };
  const defaultCreateAdminUser: CreateUserRequest = {
    displayName: 'Test User',
    password: 'testPassword',
    email: 'testUser1@usersrole.com',
    roles: ['user', 'admin']
  };
  const defaultDeleteUser: DeleteUserRequest = {
    uid: 'testUid1'
  };
  const defaultEditUser: UpdateUserRequest = {
    uid: 'testUid1',
    ...defaultCreateUser
  };

  beforeEach(() => {
    usersService = new UsersService(httpClientMock, snackbarServiceMock);
  });

  it('should create an instance of UsersService', () => {
    expect(usersService).toBeInstanceOf(UsersService);
  });

  it('should retrieve users', (done) => {
    const users: User[] = [testUser1, testUser2, testUser3];
    httpClientMock.get.mockReturnValue(of({ users }));

    usersService.users$.subscribe((result) => {
      expect(result).toEqual(users);
      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${usersService['baseUrl']}`
      );
      done();
    });
  });

  it('should handle retrieve users HTTP failure', () => {
    httpClientMock.get.mockReturnValue(throwError(() => defaultErrorResponse));

    usersService.users$.subscribe({
      error: (error) => {
        expect(error).toEqual(defaultErrorResponse);
      }
    });
    expect(snackbarServiceMock.error).toHaveBeenCalledWith(
      defaultErrorMessage,
      { variant: 'filled' },
      true
    );
  });

  it('should retrieve a user by Id', () => {
    httpClientMock.get.mockReturnValue(of(testUser1));

    usersService.user$(testUser1.uid).subscribe({
      next: (user) => {
        expect(user).toEqual(testUser1);
      }
    });
    expect(httpClientMock.get).toHaveBeenCalled();
  });

  it('should handle retrieve user by Id HTTP failure', () => {
    httpClientMock.get.mockReturnValue(throwError(() => defaultErrorResponse));

    usersService.user$(testUser1.uid).subscribe({
      error: (error) => {
        expect(error).toEqual(defaultErrorResponse);
      }
    });
    expect(httpClientMock.get).toHaveBeenCalled();
    expect(snackbarServiceMock.error).toHaveBeenCalledWith(
      defaultErrorMessage,
      { variant: 'filled' },
      true
    );
  });

  it('should create a user', () => {
    const response = { uid: testUser1.uid };
    httpClientMock.post.mockReturnValue(of(response));

    usersService.create(defaultCreateUser).subscribe({
      next: (uid) => {
        expect(uid).toEqual(response);
      }
    });
    expect(httpClientMock.post).toHaveBeenCalled();
  });

  it('should create a user via admin call', () => {
    const response = { uid: testUser1.uid };
    httpClientMock.post.mockReturnValue(of(response));

    usersService.createAdmin(defaultCreateAdminUser).subscribe({
      next: (uid) => {
        expect(uid).toEqual(response);
      }
    });
    expect(httpClientMock.post).toHaveBeenCalled();
  });

  it('should handle create user HTTP failure', () => {
    httpClientMock.post.mockReturnValue(throwError(() => defaultErrorResponse));

    usersService.create(defaultCreateUser).subscribe({
      error: (error) => {
        expect(error).toEqual(defaultErrorResponse);
      }
    });
    expect(httpClientMock.post).toHaveBeenCalled();
    expect(snackbarServiceMock.error).toHaveBeenCalledWith(
      defaultErrorMessage,
      { variant: 'filled' },
      true
    );
  });

  it('should edit a user', () => {
    httpClientMock.patch.mockReturnValue(of(''));

    usersService.edit(defaultEditUser).subscribe({
      next: (response) => {
        expect(response).toEqual('');
      }
    });
    expect(httpClientMock.patch).toHaveBeenCalled();
  });

  it('should handle edit user HTTP failure', () => {
    httpClientMock.patch.mockReturnValue(
      throwError(() => defaultErrorResponse)
    );

    usersService.edit(defaultEditUser).subscribe({
      error: (error) => {
        expect(error).toEqual(defaultErrorResponse);
      }
    });
    expect(httpClientMock.patch).toHaveBeenCalled();
    expect(snackbarServiceMock.error).toHaveBeenCalledWith(
      defaultErrorMessage,
      { variant: 'filled' },
      true
    );
  });

  it('should delete a user', () => {
    httpClientMock.delete.mockReturnValue(of(''));

    usersService.delete(defaultDeleteUser).subscribe({
      next: (response) => {
        expect(response).toEqual('');
      }
    });
    expect(httpClientMock.delete).toHaveBeenCalled();
  });

  it('should handle delete user HTTP failure', () => {
    httpClientMock.delete.mockReturnValue(
      throwError(() => defaultErrorResponse)
    );

    usersService.delete(defaultDeleteUser).subscribe({
      error: (error) => {
        expect(error).toEqual(defaultErrorResponse);
      }
    });
    expect(httpClientMock.delete).toHaveBeenCalled();
    expect(snackbarServiceMock.error).toHaveBeenCalledWith(
      defaultErrorMessage,
      { variant: 'filled' },
      true
    );
  });
});
