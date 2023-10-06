import { TestBed } from '@angular/core/testing';
import {
  GlobalHttpErrorHandlerInterceptor,
  GlobalHttpErrorHandlerInterceptorProvider
} from './global-http-error-handler.interceptor';
import { expect } from '@jest/globals';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { throwError } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('GlobalHttpErrorHandlerInterceptor', () => {
  let interceptor: GlobalHttpErrorHandlerInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        NoopAnimationsModule
      ],
      providers: [
        GlobalHttpErrorHandlerInterceptor,
        GlobalHttpErrorHandlerInterceptorProvider
      ]
    });

    interceptor = TestBed.inject(GlobalHttpErrorHandlerInterceptor);
  });

  it('should create an instance of GlobalHttpErrorHandlerInterceptor', () => {
    expect(interceptor).toBeInstanceOf(GlobalHttpErrorHandlerInterceptor);
  });

  it('should still send failure after retries', (done) => {
    const request = new HttpRequest('GET', 'http://mock');
    const httpHandlerMock: jest.Mocked<any> = {
      handle: () => throwError(() => new HttpErrorResponse({ status: 500 }))
    };

    interceptor.intercept(request, httpHandlerMock).subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
        done();
      }
    });
  });

  it('should catch the error if 403 and handle', (done) => {
    const request = new HttpRequest('GET', 'http://mock');
    const httpHandlerMock: jest.Mocked<any> = {
      handle: () => throwError(() => new HttpErrorResponse({ status: 403 }))
    };
    jest.spyOn(httpHandlerMock, 'handle');

    interceptor.intercept(request, httpHandlerMock).subscribe({
      complete: () => {
        expect(httpHandlerMock.handle).toHaveBeenCalled();
        done();
      }
    });
  });
});
