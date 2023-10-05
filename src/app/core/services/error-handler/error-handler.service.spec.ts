import { ErrorHandlerService } from './error-handler.service';
import { expect } from '@jest/globals';

describe('ErrorHandlerService', () => {
  let errorHandlerService: ErrorHandlerService;
  const snackbarServiceMock: jest.Mocked<any> = {
    error: jest.fn()
  };
  const ngZoneMock: jest.Mocked<any> = {
    run: jest.fn()
  };

  beforeEach(() => {
    errorHandlerService = new ErrorHandlerService(
      snackbarServiceMock,
      ngZoneMock
    );
  });

  it('should create an instance of ErrorHandlerService', () => {
    expect(errorHandlerService).toBeInstanceOf(ErrorHandlerService);
  });

  it('should call zone.run when handleError is called', () => {
    const errorMock = new Error('Test error');

    errorHandlerService.handleError(errorMock);

    expect(ngZoneMock.run).toHaveBeenCalled();
  });

  it('should log the error message to console when handleError is called', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    const errorMock = new Error('Test error');
    errorHandlerService.handleError(errorMock);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Caught by Error Handler Service: ',
      errorMock
    );
    consoleWarnSpy.mockRestore();
  });
});
