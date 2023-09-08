import { AlertService } from './alert.service';
import { expect } from '@jest/globals';
import { AlertOptions } from '../../models/alert.model';
import { PaletteColors } from '../../../shared/models/palette-colors.model';

describe('AlertService', () => {
  let alertService: AlertService;
  let defaultAlertType: PaletteColors = 'primary';
  let defaultAlertMessage = 'default alert message';
  let defaultAlert = {
    type: defaultAlertType,
    message: defaultAlertMessage
  };

  beforeEach(() => {
    alertService = new AlertService();
  });

  it('should be created', () => {
    expect(alertService).toBeTruthy();
  });

  it('should alert a message', (done) => {
    alertService.onAlert().subscribe((alert) => {
      expect(alert).toEqual(defaultAlert);
      done();
    });

    alertService.alert(defaultAlert);
  });

  it('should clear an alert', (done) => {
    const response = { id: 'default-alert' };

    alertService.onAlert().subscribe((alert) => {
      expect(alert).toEqual(response);
      done();
    });

    alertService.alert(defaultAlert);
    alertService.clear();
  });

  it('should send an alert with options', (done) => {
    const alertOptions: AlertOptions = {
      id: 'options-id',
      autoClose: false,
      autoCloseTimeout: 5000,
      keepAfterRouteChange: false,
      icon: 'bug_report',
      closeButton: true,
      maxSize: 5
    };

    alertService.onAlert(alertOptions.id).subscribe((alert) => {
      expect(alert.type).toBe(defaultAlertType);
      expect(alert.message).toBe(defaultAlertMessage);
      expect(alert.id).toBe(alertOptions.id);
      expect(alert.autoClose).toBe(alertOptions.autoClose);
      expect(alert.autoCloseTimeout).toBe(alertOptions.autoCloseTimeout);
      expect(alert.keepAfterRouteChange).toBe(
        alertOptions.keepAfterRouteChange
      );
      expect(alert.icon).toBe(alertOptions.icon);
      expect(alert.closeButton).toBe(alertOptions.closeButton);
      expect(alert.maxSize).toBe(alertOptions.maxSize);
      done();
    });

    alertService.send(defaultAlertType, defaultAlertMessage, alertOptions);
  });

  it('should send a primary alert', (done) => {
    const alertType: PaletteColors = 'primary';

    alertService.onAlert().subscribe((alert) => {
      expect(alert.type).toEqual(alertType);
      expect(alert.message).toEqual(defaultAlertMessage);
      expect(alert.icon).toBeUndefined();
      done();
    });

    alertService.send(alertType, defaultAlertMessage);
  });

  it('should send an accent alert', (done) => {
    const alertType: PaletteColors = 'accent';

    alertService.onAlert().subscribe((alert) => {
      expect(alert.type).toEqual(alertType);
      expect(alert.message).toEqual(defaultAlertMessage);
      expect(alert.icon).toBeUndefined();
      done();
    });

    alertService.send(alertType, defaultAlertMessage);
  });

  it('should send a success alert', (done) => {
    const alertType: PaletteColors = 'success';

    alertService.onAlert().subscribe((alert) => {
      expect(alert.type).toEqual(alertType);
      expect(alert.message).toEqual(defaultAlertMessage);
      expect(alert.icon).toBeUndefined();
      done();
    });

    alertService.success(defaultAlertMessage);
  });

  it('should send a success alert with default icon', (done) => {
    const alertType: PaletteColors = 'success';
    const alertIcon = 'check_circle';

    alertService.onAlert().subscribe((alert) => {
      expect(alert.type).toEqual(alertType);
      expect(alert.message).toEqual(defaultAlertMessage);
      expect(alert.icon).toEqual(alertIcon);
      done();
    });

    alertService.success(defaultAlertMessage, {}, true);
  });

  it('should send an error alert', (done) => {
    const alertType: PaletteColors = 'error';

    alertService.onAlert().subscribe((alert) => {
      expect(alert.type).toEqual(alertType);
      expect(alert.message).toEqual(defaultAlertMessage);
      expect(alert.icon).toBeUndefined();
      done();
    });

    alertService.error(defaultAlertMessage);
  });

  it('should send an error alert with default icon', (done) => {
    const alertType: PaletteColors = 'error';
    const alertIcon = 'report';

    alertService.onAlert().subscribe((alert) => {
      expect(alert.type).toEqual(alertType);
      expect(alert.message).toEqual(defaultAlertMessage);
      expect(alert.icon).toEqual(alertIcon);
      done();
    });

    alertService.error(defaultAlertMessage, {}, true);
  });

  it('should send a warn alert', (done) => {
    const alertType: PaletteColors = 'warn';

    alertService.onAlert().subscribe((alert) => {
      expect(alert.type).toEqual(alertType);
      expect(alert.message).toEqual(defaultAlertMessage);
      expect(alert.icon).toBeUndefined();
      done();
    });

    alertService.warn(defaultAlertMessage);
  });

  it('should send a warn alert with default icon', (done) => {
    const alertType: PaletteColors = 'warn';
    const alertIcon = 'warning';

    alertService.onAlert().subscribe((alert) => {
      expect(alert.type).toEqual(alertType);
      expect(alert.message).toEqual(defaultAlertMessage);
      expect(alert.icon).toEqual(alertIcon);
      done();
    });

    alertService.warn(defaultAlertMessage, {}, true);
  });

  it('should send an info alert', (done) => {
    const alertType: PaletteColors = 'info';

    alertService.onAlert().subscribe((alert) => {
      expect(alert.type).toEqual(alertType);
      expect(alert.message).toEqual(defaultAlertMessage);
      expect(alert.icon).toBeUndefined();
      done();
    });

    alertService.info(defaultAlertMessage);
  });

  it('should send an info alert with default icon', (done) => {
    const alertType: PaletteColors = 'info';
    const alertIcon = 'info';

    alertService.onAlert().subscribe((alert) => {
      expect(alert.type).toEqual(alertType);
      expect(alert.message).toEqual(defaultAlertMessage);
      expect(alert.icon).toEqual(alertIcon);
      done();
    });

    alertService.info(defaultAlertMessage, {}, true);
  });
});
