import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Alert } from '../models/alert.model';
import { PaletteColors } from '../models/palette-colors.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<Alert | null>();
  private keepAfterNavigationChange = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          this.keepAfterNavigationChange = false;
        } else {
          this.subject.next(null);
        }
      }
    });
  }

  send(type: PaletteColors, message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: type, text: message });
  }

  success(message: string, keepAfterNavigationChange = false) {
    this.send('success', message, keepAfterNavigationChange);
  }

  error(message: string, keepAfterNavigationChange = false) {
    this.send('error', message, keepAfterNavigationChange);
  }

  warn(message: string, keepAfterNavigationChange = false) {
    this.send('warn', message, keepAfterNavigationChange);
  }

  info(message: string, keepAfterNavigationChange = false) {
    this.send('info', message, keepAfterNavigationChange);
  }

  getAlert(): Observable<Alert | null> {
    return this.subject.asObservable();
  }
}
