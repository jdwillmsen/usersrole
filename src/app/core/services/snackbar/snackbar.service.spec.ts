import { expect } from '@jest/globals';
import { SnackbarService } from './snackbar.service';
import { PaletteColors } from '../../../shared/models/palette-colors.model';
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../../shared/components/snackbar/snackbar.component';
import { SnackbarOptions } from '../../models/snackbar.model';

describe('SnackbarService', () => {
  let snackbarService: SnackbarService;
  const snackbarMock: jest.Mocked<any> = {
    openFromComponent: jest.fn(),
    dismiss: jest.fn()
  };
  const defaultType: PaletteColors = 'primary';
  const defaultMessage = 'test message';
  const defaultDuration = 3000;
  const defaultHorizontalPosition: MatSnackBarHorizontalPosition = 'end';
  const defaultVerticalPosition: MatSnackBarVerticalPosition = 'bottom';

  beforeEach(() => {
    snackbarService = new SnackbarService(snackbarMock);
  });

  it('should create an instance of SnackbarService', () => {
    expect(snackbarService).toBeInstanceOf(SnackbarService);
  });

  it('should send a snackbar', () => {
    snackbarService.send(defaultType, defaultMessage);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: undefined,
          buttonText: undefined
        },
        direction: undefined,
        duration: undefined,
        horizontalPosition: defaultHorizontalPosition,
        verticalPosition: defaultVerticalPosition,
        panelClass: ['icon', defaultType]
      }
    );
  });

  it('should send a snackbar with all options', () => {
    const options: SnackbarOptions = {
      variant: 'filled',
      autoClose: true,
      autoCloseTimeout: 5000,
      icon: 'bug_report',
      buttonText: 'Test',
      direction: 'rtl',
      horizontalPosition: 'start',
      verticalPosition: 'top'
    };

    snackbarService.send(defaultType, defaultMessage, options);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: options.icon,
          buttonText: options.buttonText
        },
        direction: options.direction,
        duration: options.autoCloseTimeout,
        horizontalPosition: options.horizontalPosition,
        verticalPosition: options.verticalPosition,
        panelClass: [options.variant, defaultType]
      }
    );
  });

  it('should send a snackbar with some options', () => {
    const options: SnackbarOptions = {
      variant: 'default',
      autoClose: true
    };

    snackbarService.send(defaultType, defaultMessage, options);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: undefined,
          buttonText: undefined
        },
        direction: undefined,
        duration: defaultDuration,
        horizontalPosition: defaultHorizontalPosition,
        verticalPosition: defaultVerticalPosition,
        panelClass: ['icon', options.variant, defaultType]
      }
    );
  });

  it('should send a success snackbar', () => {
    snackbarService.success(defaultMessage);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: undefined,
          buttonText: undefined
        },
        direction: undefined,
        duration: undefined,
        horizontalPosition: defaultHorizontalPosition,
        verticalPosition: defaultVerticalPosition,
        panelClass: ['icon', 'success']
      }
    );
  });

  it('should send a success snackbar with defaultIcon', () => {
    snackbarService.success(defaultMessage, undefined, true);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: 'check_circle',
          buttonText: undefined
        },
        direction: undefined,
        duration: undefined,
        horizontalPosition: defaultHorizontalPosition,
        verticalPosition: defaultVerticalPosition,
        panelClass: ['icon', 'success']
      }
    );
  });

  it('should send a success snackbar with options', () => {
    const options: SnackbarOptions = {
      variant: 'outlined',
      icon: 'bug_report'
    };
    snackbarService.success(defaultMessage, options, false);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: options.icon,
          buttonText: undefined
        },
        direction: undefined,
        duration: undefined,
        horizontalPosition: defaultHorizontalPosition,
        verticalPosition: defaultVerticalPosition,
        panelClass: ['icon', options.variant, 'success']
      }
    );
  });

  it('should send a success snackbar with default icon overriding options', () => {
    const options: SnackbarOptions = {
      icon: 'bug_report'
    };
    snackbarService.success(defaultMessage, options, true);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: 'check_circle',
          buttonText: undefined
        },
        direction: undefined,
        duration: undefined,
        horizontalPosition: defaultHorizontalPosition,
        verticalPosition: defaultVerticalPosition,
        panelClass: ['icon', 'success']
      }
    );
  });

  it('should send an error snackbar', () => {
    snackbarService.error(defaultMessage);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: undefined,
          buttonText: undefined
        },
        direction: undefined,
        duration: undefined,
        horizontalPosition: defaultHorizontalPosition,
        verticalPosition: defaultVerticalPosition,
        panelClass: ['icon', 'error']
      }
    );
  });

  it('should send an error snackbar with defaultIcon', () => {
    snackbarService.error(defaultMessage, undefined, true);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: 'report',
          buttonText: undefined
        },
        direction: undefined,
        duration: undefined,
        horizontalPosition: defaultHorizontalPosition,
        verticalPosition: defaultVerticalPosition,
        panelClass: ['icon', 'error']
      }
    );
  });

  it('should send an error snackbar with options', () => {
    const options: SnackbarOptions = {
      variant: 'outlined',
      icon: 'bug_report'
    };
    snackbarService.error(defaultMessage, options, false);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: options.icon,
          buttonText: undefined
        },
        direction: undefined,
        duration: undefined,
        horizontalPosition: defaultHorizontalPosition,
        verticalPosition: defaultVerticalPosition,
        panelClass: ['icon', options.variant, 'error']
      }
    );
  });

  it('should send an error snackbar with default icon overriding options', () => {
    const options: SnackbarOptions = {
      icon: 'bug_report'
    };
    snackbarService.error(defaultMessage, options, true);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: 'report',
          buttonText: undefined
        },
        direction: undefined,
        duration: undefined,
        horizontalPosition: defaultHorizontalPosition,
        verticalPosition: defaultVerticalPosition,
        panelClass: ['icon', 'error']
      }
    );
  });

  it('should send a warn snackbar', () => {
    snackbarService.warn(defaultMessage);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: undefined,
          buttonText: undefined
        },
        direction: undefined,
        duration: undefined,
        horizontalPosition: defaultHorizontalPosition,
        verticalPosition: defaultVerticalPosition,
        panelClass: ['icon', 'warn']
      }
    );
  });

  it('should send a warn snackbar with defaultIcon', () => {
    snackbarService.warn(defaultMessage, undefined, true);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: 'warning',
          buttonText: undefined
        },
        direction: undefined,
        duration: undefined,
        horizontalPosition: defaultHorizontalPosition,
        verticalPosition: defaultVerticalPosition,
        panelClass: ['icon', 'warn']
      }
    );
  });

  it('should send a warn snackbar with options', () => {
    const options: SnackbarOptions = {
      variant: 'outlined',
      icon: 'bug_report'
    };
    snackbarService.warn(defaultMessage, options, false);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: options.icon,
          buttonText: undefined
        },
        direction: undefined,
        duration: undefined,
        horizontalPosition: defaultHorizontalPosition,
        verticalPosition: defaultVerticalPosition,
        panelClass: ['icon', options.variant, 'warn']
      }
    );
  });

  it('should send a warn snackbar with default icon overriding options', () => {
    const options: SnackbarOptions = {
      icon: 'bug_report'
    };
    snackbarService.warn(defaultMessage, options, true);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: 'warning',
          buttonText: undefined
        },
        direction: undefined,
        duration: undefined,
        horizontalPosition: defaultHorizontalPosition,
        verticalPosition: defaultVerticalPosition,
        panelClass: ['icon', 'warn']
      }
    );
  });

  it('should send an info snackbar', () => {
    snackbarService.info(defaultMessage);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: undefined,
          buttonText: undefined
        },
        direction: undefined,
        duration: undefined,
        horizontalPosition: defaultHorizontalPosition,
        verticalPosition: defaultVerticalPosition,
        panelClass: ['icon', 'info']
      }
    );
  });

  it('should send an info snackbar with defaultIcon', () => {
    snackbarService.info(defaultMessage, undefined, true);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: 'info',
          buttonText: undefined
        },
        direction: undefined,
        duration: undefined,
        horizontalPosition: defaultHorizontalPosition,
        verticalPosition: defaultVerticalPosition,
        panelClass: ['icon', 'info']
      }
    );
  });

  it('should send an info snackbar with options', () => {
    const options: SnackbarOptions = {
      variant: 'outlined',
      icon: 'bug_report'
    };
    snackbarService.info(defaultMessage, options, false);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: options.icon,
          buttonText: undefined
        },
        direction: undefined,
        duration: undefined,
        horizontalPosition: defaultHorizontalPosition,
        verticalPosition: defaultVerticalPosition,
        panelClass: ['icon', options.variant, 'info']
      }
    );
  });

  it('should send an info snackbar with default icon overriding options', () => {
    const options: SnackbarOptions = {
      icon: 'bug_report'
    };
    snackbarService.info(defaultMessage, options, true);

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      {
        data: {
          message: defaultMessage,
          icon: 'info',
          buttonText: undefined
        },
        direction: undefined,
        duration: undefined,
        horizontalPosition: defaultHorizontalPosition,
        verticalPosition: defaultVerticalPosition,
        panelClass: ['icon', 'info']
      }
    );
  });

  it('should clear the snackbar', () => {
    snackbarService.clear();

    expect(snackbarMock.dismiss).toHaveBeenCalled();
  });
});
