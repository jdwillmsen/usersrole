import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaletteColors } from '../../../shared/models/palette-colors.model';
import { PaletteFormGroup } from '../../models/palette-form-group';
import { FirestoreService } from '../../../core/services/firestore/firestore.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SnackbarService } from '../../../core/services/snackbar/snackbar.service';
import { Theme } from '../../../core/models/theme.model';
import { CreatePaletteComponent } from '../create-palette/create-palette.component';
import { NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  DARK_THEME_SAVED_SUCCESS_MESSAGE,
  LIGHT_THEME_SAVED_SUCCESS_MESSAGE
} from '../../../core/constants/message.constants';

@Component({
  selector: 'app-create-theme',
  templateUrl: './create-theme.component.html',
  styleUrls: ['./create-theme.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    CreatePaletteComponent
  ]
})
export class CreateThemeComponent {
  themeForm = new FormGroup({
    primaryPalette: new FormGroup(new PaletteFormGroup().paletteFormGroup),
    accentPalette: new FormGroup(new PaletteFormGroup().paletteFormGroup),
    warnPalette: new FormGroup(new PaletteFormGroup().paletteFormGroup),
    successPalette: new FormGroup(new PaletteFormGroup().paletteFormGroup),
    errorPalette: new FormGroup(new PaletteFormGroup().paletteFormGroup),
    infoPalette: new FormGroup(new PaletteFormGroup().paletteFormGroup)
  });
  palettes: { name: string; type: PaletteColors }[] = [
    { name: 'primaryPalette', type: 'primary' },
    { name: 'accentPalette', type: 'accent' },
    { name: 'warnPalette', type: 'warn' },
    { name: 'successPalette', type: 'success' },
    { name: 'errorPalette', type: 'error' },
    { name: 'infoPalette', type: 'info' }
  ];
  uid = '';

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) {
    this.authService.user$.subscribe({
      next: (user) => {
        if (user !== null) {
          this.uid = user.uid;
        }
      },
      error: (error) => {
        this.snackbarService.error(error.error, { variant: 'filled' }, true);
      }
    });
  }

  saveLightTheme() {
    this.firestoreService
      .setCustomLightTheme(this.uid, this.themeForm.value as Theme)
      .then(() => {
        this.snackbarService.success(
          LIGHT_THEME_SAVED_SUCCESS_MESSAGE,
          { variant: 'filled' },
          true
        );
      })
      .catch((error) => {
        this.snackbarService.error(error, { variant: 'filled' }, true);
      });
  }

  saveDarkTheme() {
    this.firestoreService
      .setCustomDarkTheme(this.uid, this.themeForm.value as Theme)
      .then(() => {
        this.snackbarService.success(
          DARK_THEME_SAVED_SUCCESS_MESSAGE,
          { variant: 'filled' },
          true
        );
      })
      .catch((error) => {
        this.snackbarService.error(error, { variant: 'filled' }, true);
      });
  }
}
