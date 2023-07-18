import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Option } from '../models/option.model';
import { StyleManagerService } from './style-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(
    private http: HttpClient,
    private styleManagerService: StyleManagerService
  ) {}

  getThemeOptions(): Observable<Array<Option>> {
    return this.http.get<Array<Option>>('assets/options.json');
  }

  setTheme(themeToSet: string) {
    this.styleManagerService.setStyle(
      'theme',
      `node_modules/@angular/material/prebuilt-themes/${themeToSet}.css`
    );
  }
}
