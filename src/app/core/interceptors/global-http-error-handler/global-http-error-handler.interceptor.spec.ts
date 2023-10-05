import { TestBed } from '@angular/core/testing';
import {
  GlobalHttpErrorHandlerInterceptor,
  GlobalHttpErrorHandlerInterceptorProvider
} from './global-http-error-handler.interceptor';
import { expect } from '@jest/globals';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  HttpClient,
  HttpErrorResponse,
  HttpRequest
} from '@angular/common/http';
import { throwError } from 'rxjs';

describe('GlobalHttpErrorHandlerInterceptor', () => {
  let interceptor: GlobalHttpErrorHandlerInterceptor;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GlobalHttpErrorHandlerInterceptor,
        GlobalHttpErrorHandlerInterceptorProvider
      ]
    });

    interceptor = TestBed.inject(GlobalHttpErrorHandlerInterceptor);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
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
});
