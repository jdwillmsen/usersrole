import { UserFormComponent } from './user-form.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActionType,
  UserFormService,
  UserFormType
} from '../../services/user-form/user-form.service';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../../../core/models/users.model';

describe('UserFormComponent', () => {
  const user: User & { lastSignInTime: string; creationTime: string } = {
    uid: 'test-uid-1',
    displayName: 'Test User',
    roles: ['user'],
    email: 'test-user-1@usersrole.com',
    lastSignInTime: 'Thu, 11 May 2023 04:18:43 GMT',
    creationTime: 'Thu, 11 May 2023 03:10:12 GMT'
  };
  const defaultUser: User = {
    uid: '',
    displayName: '',
    roles: [],
    email: ''
  };

  it('should mount', () => {
    cy.mount(UserFormComponent, {
      imports: [MatDialogModule, MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        }
      ]
    });
  });

  describe('view user form', () => {
    const viewTitle = 'View User';
    const viewType: ActionType = 'View';
    const viewTitle$ = new BehaviorSubject<UserFormType>({
      title: viewTitle,
      user,
      type: viewType
    })
      .asObservable()
      .pipe(map((userForm) => userForm.title));
    const viewUser$ = new BehaviorSubject<UserFormType>({
      title: viewTitle,
      user,
      type: viewType
    })
      .asObservable()
      .pipe(map((userForm) => userForm.user));
    const viewType$ = new BehaviorSubject<UserFormType>({
      title: viewTitle,
      user,
      type: viewType
    })
      .asObservable()
      .pipe(map((userForm) => userForm.type));
    const viewUserForm = {
      title$: viewTitle$,
      user$: viewUser$,
      type$: viewType$
    };

    it('should setup view user form properly', () => {
      cy.mount(UserFormComponent, {
        imports: [MatDialogModule, MatSnackBarModule, BrowserAnimationsModule],
        providers: [
          {
            provide: MatDialogRef,
            useValue: {}
          },
          {
            provide: UserFormService,
            useValue: viewUserForm
          }
        ]
      });
      cy.getByCy('title').should('be.visible').and('contain.text', viewTitle);
      cy.getByCy('email-address-field')
        .should('be.visible')
        .find('input')
        .and('have.attr', 'readonly', 'readonly')
        .and('contain.value', user.email);
      cy.getByCy('emailAddressLabel')
        .should('be.visible')
        .and('contain.text', 'Email Address');
      cy.getByCy('display-name-field')
        .should('be.visible')
        .find('input')
        .and('have.attr', 'readonly', 'readonly')
        .and('contain.value', user.displayName);
      cy.getByCy('displayNameLabel')
        .should('be.visible')
        .and('contain.text', 'Display Name');
      cy.getByCy('roles-field')
        .should('be.visible')
        .find('input')
        .and('have.attr', 'readonly', 'readonly')
        .and('contain.value', 'User');
      cy.getByCy('rolesLabel')
        .should('be.visible')
        .and('contain.text', 'Roles');
      cy.getByCy('uidField')
        .should('be.visible')
        .find('input')
        .and('have.attr', 'readonly', 'readonly')
        .and('contain.value', user.uid);
      cy.getByCy('uidLabel').should('be.visible').and('contain.text', 'Uid');
      cy.getByCy('lastSignInTimeField')
        .should('be.visible')
        .find('input')
        .and('have.attr', 'readonly', 'readonly')
        .and('contain.value', user.lastSignInTime);
      cy.getByCy('lastSignInTimeLabel')
        .should('be.visible')
        .and('contain.text', 'Last Sign In Time');
      cy.getByCy('accountCreationTimeField')
        .should('be.visible')
        .find('input')
        .and('have.attr', 'readonly', 'readonly')
        .and('contain.value', user.creationTime);
      cy.getByCy('accountCreationTimeLabel')
        .should('be.visible')
        .and('contain.text', 'Account Creation Time');
      cy.getByCy('close-button')
        .should('be.visible')
        .and('be.enabled')
        .and('contain.text', 'Close');
    });
  });

  describe('edit user form', () => {
    const editTitle = 'Edit User';
    const editType: ActionType = 'Edit';
    const editTitle$ = new BehaviorSubject<UserFormType>({
      title: editTitle,
      user,
      type: editType
    })
      .asObservable()
      .pipe(map((userForm) => userForm.title));
    const editUser$ = new BehaviorSubject<UserFormType>({
      title: editTitle,
      user,
      type: editType
    })
      .asObservable()
      .pipe(map((userForm) => userForm.user));
    const editType$ = new BehaviorSubject<UserFormType>({
      title: editTitle,
      user,
      type: editType
    })
      .asObservable()
      .pipe(map((userForm) => userForm.type));
    const editUserForm = {
      title$: editTitle$,
      user$: editUser$,
      type$: editType$
    };

    it('should setup edit user form properly', () => {
      cy.mount(UserFormComponent, {
        imports: [MatDialogModule, MatSnackBarModule, BrowserAnimationsModule],
        providers: [
          {
            provide: MatDialogRef,
            useValue: {}
          },
          {
            provide: UserFormService,
            useValue: editUserForm
          }
        ]
      });
      cy.getByCy('title').should('be.visible').and('contain.text', editTitle);
      cy.getByCy('email-address-field')
        .should('be.visible')
        .find('input')
        .and('contain.value', user.email);
      cy.getByCy('emailAddressLabel')
        .should('be.visible')
        .and('contain.text', 'Email Address');
      cy.getByCy('display-name-field')
        .should('be.visible')
        .find('input')
        .and('contain.value', user.displayName);
      cy.getByCy('displayNameLabel')
        .should('be.visible')
        .and('contain.text', 'Display Name');
      cy.getByCy('roles-field')
        .should('be.visible')
        .and('contain.text', 'User');
      cy.getByCy('rolesLabel')
        .should('be.visible')
        .and('contain.text', 'Roles');
      cy.getByCy('password-field')
        .should('be.visible')
        .find('input')
        .and('contain.value', '');
      cy.getByCy('passwordLabel')
        .should('be.visible')
        .and('contain.text', 'Password');
      cy.getByCy('passwordVisibilityButton')
        .should('be.visible')
        .and('be.enabled');
      cy.getByCy('confirm-password-field')
        .should('be.visible')
        .find('input')
        .and('contain.value', '');
      cy.getByCy('confirmPasswordLabel')
        .should('be.visible')
        .and('contain.text', 'Confirm Password');
      cy.getByCy('confirmPasswordVisibilityButton')
        .should('be.visible')
        .and('be.enabled');
      cy.getByCy('close-button')
        .should('be.visible')
        .and('be.enabled')
        .and('contain.text', 'Cancel');
      cy.getByCy('save-button')
        .should('be.visible')
        .and('be.disabled')
        .and('contain.text', editType);
    });

    it('should display correct error field messages', () => {
      cy.mount(UserFormComponent, {
        imports: [MatDialogModule, MatSnackBarModule, BrowserAnimationsModule],
        providers: [
          {
            provide: MatDialogRef,
            useValue: {}
          },
          {
            provide: UserFormService,
            useValue: editUserForm
          }
        ]
      });
      cy.getByCy('email-address-field').find('input').clear().blur();
      cy.getByCy('email-address-field')
        .should('contain.text', 'Email is required')
        .type('test')
        .should('contain.text', 'Enter a valid email');
      cy.getByCy('display-name-field').find('input').clear().blur();
      cy.getByCy('display-name-field').should(
        'contain.text',
        'Display name is required'
      );
      cy.getByCy('roles-field').click();
      cy.getByCy('user-role-option').click();
      cy.get('.cdk-overlay-backdrop').click({ force: true });
      cy.getByCy('roles-field').should('contain.text', 'Roles is required');
      cy.getByCy('password-field').type('test').find('input').blur();
      cy.getByCy('password-field').should(
        'contain.text',
        'Password must be at least 6 characters long'
      );
      cy.getByCy('confirm-password-field').type('tes').find('input').blur();
      cy.getByCy('confirm-password-field').should(
        'contain.text',
        'Password must be at least 6 characters long'
      );
      cy.getByCy('matchingPasswordError')
        .should('contain.text', 'Password mismatch')
        .and('be.visible');
    });
  });

  describe('delete user form', () => {
    const deleteTitle = 'Delete User';
    const deleteType: ActionType = 'Delete';
    const deleteTitle$ = new BehaviorSubject<UserFormType>({
      title: deleteTitle,
      user,
      type: deleteType
    })
      .asObservable()
      .pipe(map((userForm) => userForm.title));
    const deleteUser$ = new BehaviorSubject<UserFormType>({
      title: deleteTitle,
      user,
      type: deleteType
    })
      .asObservable()
      .pipe(map((userForm) => userForm.user));
    const deleteType$ = new BehaviorSubject<UserFormType>({
      title: deleteTitle,
      user,
      type: deleteType
    })
      .asObservable()
      .pipe(map((userForm) => userForm.type));
    const deleteUserForm = {
      title$: deleteTitle$,
      user$: deleteUser$,
      type$: deleteType$
    };

    it('should setup delete user form properly', () => {
      cy.mount(UserFormComponent, {
        imports: [MatDialogModule, MatSnackBarModule, BrowserAnimationsModule],
        providers: [
          {
            provide: MatDialogRef,
            useValue: {}
          },
          {
            provide: UserFormService,
            useValue: deleteUserForm
          }
        ]
      });
      cy.getByCy('title').should('be.visible').and('contain.text', deleteTitle);
      cy.getByCy('email-address-field')
        .should('be.visible')
        .find('input')
        .and('have.attr', 'readonly', 'readonly')
        .and('contain.value', user.email);
      cy.getByCy('email-address-field')
        .should('be.visible')
        .and('contain.text', 'Email Address');
      cy.getByCy('display-name-field')
        .should('be.visible')
        .find('input')
        .and('have.attr', 'readonly', 'readonly')
        .and('contain.value', user.displayName);
      cy.getByCy('displayNameLabel')
        .should('be.visible')
        .and('contain.text', 'Display Name');
      cy.getByCy('roles-field')
        .should('be.visible')
        .find('input')
        .and('have.attr', 'readonly', 'readonly')
        .and('contain.value', 'User');
      cy.getByCy('rolesLabel')
        .should('be.visible')
        .and('contain.text', 'Roles');
      cy.getByCy('uidField')
        .should('be.visible')
        .find('input')
        .and('have.attr', 'readonly', 'readonly')
        .and('contain.value', user.uid);
      cy.getByCy('uidLabel').should('be.visible').and('contain.text', 'Uid');
      cy.getByCy('lastSignInTimeField')
        .should('be.visible')
        .find('input')
        .and('have.attr', 'readonly', 'readonly')
        .and('contain.value', user.lastSignInTime);
      cy.getByCy('lastSignInTimeLabel')
        .should('be.visible')
        .and('contain.text', 'Last Sign In Time');
      cy.getByCy('accountCreationTimeField')
        .should('be.visible')
        .find('input')
        .and('have.attr', 'readonly', 'readonly')
        .and('contain.value', user.creationTime);
      cy.getByCy('accountCreationTimeLabel')
        .should('be.visible')
        .and('contain.text', 'Account Creation Time');
      cy.getByCy('close-button')
        .should('be.visible')
        .and('be.enabled')
        .and('contain.text', 'Cancel');
      cy.getByCy('save-button')
        .should('be.visible')
        .and('be.enabled')
        .and('contain.text', deleteType);
    });
  });

  describe('create user form', () => {
    const createTitle = 'Create User';
    const createType: ActionType = 'Create';
    const createTitle$ = new BehaviorSubject<UserFormType>({
      title: createTitle,
      user: defaultUser,
      type: createType
    })
      .asObservable()
      .pipe(map((userForm) => userForm.title));
    const createUser$ = new BehaviorSubject<UserFormType>({
      title: createTitle,
      user: defaultUser,
      type: createType
    })
      .asObservable()
      .pipe(map((userForm) => userForm.user));
    const createType$ = new BehaviorSubject<UserFormType>({
      title: createTitle,
      user: defaultUser,
      type: createType
    })
      .asObservable()
      .pipe(map((userForm) => userForm.type));
    const createUserForm = {
      title$: createTitle$,
      user$: createUser$,
      type$: createType$
    };

    it('should setup create user form properly', () => {
      cy.mount(UserFormComponent, {
        imports: [MatDialogModule, MatSnackBarModule, BrowserAnimationsModule],
        providers: [
          {
            provide: MatDialogRef,
            useValue: {}
          },
          {
            provide: UserFormService,
            useValue: createUserForm
          }
        ]
      });
      cy.getByCy('title').should('be.visible').and('contain.text', createTitle);
      cy.getByCy('email-address-field')
        .should('be.visible')
        .find('input')
        .and('contain.value', defaultUser.email);
      cy.getByCy('emailAddressLabel')
        .should('be.visible')
        .and('contain.text', 'Email Address');
      cy.getByCy('display-name-field')
        .should('be.visible')
        .find('input')
        .and('contain.value', defaultUser.displayName);
      cy.getByCy('displayNameLabel')
        .should('be.visible')
        .and('contain.text', 'Display Name');
      cy.getByCy('roles-field').should('be.visible').and('contain.text', '');
      cy.getByCy('rolesLabel')
        .should('be.visible')
        .and('contain.text', 'Roles');
      cy.getByCy('password-field')
        .should('be.visible')
        .find('input')
        .and('contain.value', '');
      cy.getByCy('passwordLabel')
        .should('be.visible')
        .and('contain.text', 'Password');
      cy.getByCy('passwordVisibilityButton')
        .should('be.visible')
        .and('be.enabled');
      cy.getByCy('confirm-password-field')
        .should('be.visible')
        .find('input')
        .and('contain.value', '');
      cy.getByCy('confirmPasswordLabel')
        .should('be.visible')
        .and('contain.text', 'Confirm Password');
      cy.getByCy('confirmPasswordVisibilityButton')
        .should('be.visible')
        .and('be.enabled');
      cy.getByCy('close-button')
        .should('be.visible')
        .and('be.enabled')
        .and('contain.text', 'Cancel');
      cy.getByCy('save-button')
        .should('be.visible')
        .and('be.disabled')
        .and('contain.text', createType);
    });

    it('should display correct error field messages', () => {
      cy.mount(UserFormComponent, {
        imports: [MatDialogModule, MatSnackBarModule, BrowserAnimationsModule],
        providers: [
          {
            provide: MatDialogRef,
            useValue: {}
          },
          {
            provide: UserFormService,
            useValue: createUserForm
          }
        ]
      });
      cy.getByCy('email-address-field').find('input').clear().blur();
      cy.getByCy('email-address-field')
        .should('contain.text', 'Email is required')
        .type('test')
        .should('contain.text', 'Enter a valid email');
      cy.getByCy('display-name-field').find('input').clear().blur();
      cy.getByCy('display-name-field').should(
        'contain.text',
        'Display name is required'
      );
      cy.getByCy('roles-field').click();
      cy.get('.cdk-overlay-backdrop').click({ force: true });
      cy.getByCy('roles-field').should('contain.text', 'Roles is required');
      cy.getByCy('password-field').type('test').find('input').blur();
      cy.getByCy('password-field').should(
        'contain.text',
        'Password must be at least 6 characters long'
      );
      cy.getByCy('confirm-password-field').type('tes').find('input').blur();
      cy.getByCy('confirm-password-field').should(
        'contain.text',
        'Password must be at least 6 characters long'
      );
      cy.getByCy('matchingPasswordError')
        .should('contain.text', 'Password mismatch')
        .and('be.visible');
    });
  });
});
