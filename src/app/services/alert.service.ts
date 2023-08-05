import { Injectable } from '@angular/core';
import { Observable, Subject, filter } from 'rxjs';
import { Alert, AlertOptions } from '../models/alert.model';
import { PaletteColors } from '../models/palette-colors.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<Alert>();
  private defaultId = 'default-alert';
  private closeButton = true;

  onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject
      .asObservable()
      .pipe(filter((alert) => alert && alert.id === id));
  }

  alert(alert: Alert) {
    alert.id = alert.id || this.defaultId;
    alert.closeButton =
      alert.closeButton === false ? alert.closeButton : this.closeButton;
    this.subject.next(alert);
  }

  clear(id = this.defaultId) {
    this.subject.next({ id });
  }

  send(type: PaletteColors, message: string, options?: AlertOptions) {
    this.alert({ ...options, type, message });
  }

  success(message: string, options?: AlertOptions, defaultIcon = false) {
    if (defaultIcon) options = { ...options, icon: 'check_circle' };
    this.alert({ ...options, type: 'success', message });
  }

  error(message: string, options?: AlertOptions, defaultIcon = false) {
    if (defaultIcon) options = { ...options, icon: 'report' };
    this.alert({ ...options, type: 'error', message });
  }

  warn(message: string, options?: AlertOptions, defaultIcon = false) {
    if (defaultIcon) options = { ...options, icon: 'warning' };
    this.alert({ ...options, type: 'warn', message });
  }

  info(message: string, options?: AlertOptions, defaultIcon = false) {
    if (defaultIcon) options = { ...options, icon: 'info' };
    this.alert({ ...options, type: 'info', message });
  }

  getAlert(): Observable<Alert> {
    return this.subject.asObservable();
  }
}
