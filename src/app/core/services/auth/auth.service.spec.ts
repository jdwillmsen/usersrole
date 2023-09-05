import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { expect } from '@jest/globals';

describe('AuthService', () => {
  let service: AuthService;
  let angularFireAuthSpy: jest.Mocked<AngularFireAuth>;

  beforeEach(() => {
    angularFireAuthSpy = jest.fn() as unknown as jest.Mocked<AngularFireAuth>;
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        AuthService,
        {
          provide: AngularFireAuth,
          useValue: angularFireAuthSpy
        }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
