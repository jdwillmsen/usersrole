import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PaletteColors } from '../../models/palette-colors.model';
import { PaletteFormGroup } from '../../models/palette-form-group';

@Component({
  selector: 'app-create-theme',
  templateUrl: './create-theme.component.html',
  styleUrls: ['./create-theme.component.scss']
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
}
