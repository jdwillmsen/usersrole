import { RoleGuard } from './role.guard';
import { Component } from '@angular/core';
import { provideRouter, Route, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  RouterTestingHarness,
  RouterTestingModule
} from '@angular/router/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';
import { UsersService } from '../services/users/users.service';
import { expect } from '@jest/globals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../services/snackbar/snackbar.service';
import { PermissionsService } from '../services/permissions/permissions.service';

@Component({
  selector: 'app-test-admin',
  standalone: true,
  template: ''
})
class TestAdminComponent {}

@Component({ selector: 'app-test-user', standalone: true, template: '' })
class TestUserComponent {}

@Component({ selector: 'app-test-sign-in', standalone: true, template: '' })
class TestSignInComponent {}

describe('RoleGuard', () => {
  const routes: Route[] = [
    {
      path: 'test/admin',
      canActivate: [RoleGuard],
      component: TestAdminComponent,
      data: {
        roles: ['read', 'manager', 'admin']
      }
    },
    {
      path: 'test/user',
      canActivate: [RoleGuard],
      component: TestUserComponent,
      data: {
        roles: ['read', 'user']
      }
    },
    {
      path: 'test/sign-in',
      component: TestSignInComponent
    }
  ];
  const angularFireAuthMock: jest.Mocked<any> = {
    user: of(null)
  };
  const usersServiceMock: jest.Mocked<any> = {
    users$: jest.fn()
  };
  const snackBarServiceMock: jest.Mocked<any> = {};
  const permissionsServiceMock: jest.Mocked<any> = {
    canActivateRole: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        TestAdminComponent,
        TestUserComponent,
        TestSignInComponent
      ],
      providers: [
        provideRouter(routes),
        {
          provide: AngularFireAuth,
          useValue: angularFireAuthMock
        },
        {
          provide: UsersService,
          useValue: usersServiceMock
        },
        {
          provide: MatSnackBar,
          useValue: null
        },
        {
          provide: SnackbarService,
          useValue: snackBarServiceMock
        },
        {
          provide: PermissionsService,
          useValue: permissionsServiceMock
        },
        RouterTestingModule
      ]
    });
  });

  it('should route if the route has no role requirement', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/test/sign-in');

    expect(TestBed.inject(Router).url).toEqual('/test/sign-in');
  });

  it('should route if the user does have the necessary roles', async () => {
    permissionsServiceMock.canActivateRole.mockReturnValue(of(true));

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/test/user');

    expect(TestBed.inject(Router).url).toEqual('/test/user');
  });

  it('should not route if user lack the necessary roles', async () => {
    const harness = await RouterTestingHarness.create();
    permissionsServiceMock.canActivateRole.mockReturnValue(of(false));

    await harness.navigateByUrl('/test/admin');

    // should not allow route to pass through hence will be on default
    expect(TestBed.inject(Router).url).toEqual('/');
  });
});
