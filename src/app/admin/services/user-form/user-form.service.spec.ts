import { UserFormService } from './user-form.service';
import { expect } from '@jest/globals';
import { User } from '../../../core/models/users.model';

describe('UserFormService', () => {
  let userFormService: UserFormService;
  const defaultUser: User = {
    uid: '',
    displayName: '',
    roles: [],
    email: ''
  };
  const testUser: User = {
    uid: '1',
    displayName: 'John Doe',
    roles: ['user'],
    email: 'john@usersrole.com'
  };

  beforeEach(() => {
    userFormService = new UserFormService();
  });

  it('should be created', () => {
    expect(userFormService).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(userFormService.defaultUser).toEqual(defaultUser);
  });

  it('should emit an "Edit" action - title', (done) => {
    userFormService.edit(testUser);

    userFormService.title$.subscribe((title) => {
      expect(title).toEqual('Edit User');
      done();
    });
  });

  it('should emit an "Edit" action - user', (done) => {
    userFormService.edit(testUser);

    userFormService.user$.subscribe((user) => {
      expect(user).toEqual(testUser);
      done();
    });
  });

  it('should emit an "Edit" action - title', (done) => {
    userFormService.edit(testUser);

    userFormService.type$.subscribe((type) => {
      expect(type).toEqual('Edit');
      done();
    });
  });

  it('should emit an "Create" action - title', (done) => {
    userFormService.create();

    userFormService.title$.subscribe((title) => {
      expect(title).toEqual('Create User');
      done();
    });
  });

  it('should emit an "Create" action - user', (done) => {
    userFormService.create();

    userFormService.user$.subscribe((user) => {
      expect(user).toEqual(defaultUser);
      done();
    });
  });

  it('should emit an "Create" action - title', (done) => {
    userFormService.create();

    userFormService.type$.subscribe((type) => {
      expect(type).toEqual('Create');
      done();
    });
  });

  it('should emit an "View" action - title', (done) => {
    userFormService.view(testUser);

    userFormService.title$.subscribe((title) => {
      expect(title).toEqual('View User');
      done();
    });
  });

  it('should emit an "View" action - user', (done) => {
    userFormService.view(testUser);

    userFormService.user$.subscribe((user) => {
      expect(user).toEqual(testUser);
      done();
    });
  });

  it('should emit an "View" action - title', (done) => {
    userFormService.view(testUser);

    userFormService.type$.subscribe((type) => {
      expect(type).toEqual('View');
      done();
    });
  });

  it('should emit an "Delete" action - title', (done) => {
    userFormService.delete(testUser);

    userFormService.title$.subscribe((title) => {
      expect(title).toEqual('Delete User');
      done();
    });
  });

  it('should emit an "Delete" action - user', (done) => {
    userFormService.delete(testUser);

    userFormService.user$.subscribe((user) => {
      expect(user).toEqual(testUser);
      done();
    });
  });

  it('should emit an "Delete" action - title', (done) => {
    userFormService.delete(testUser);

    userFormService.type$.subscribe((type) => {
      expect(type).toEqual('Delete');
      done();
    });
  });
});
