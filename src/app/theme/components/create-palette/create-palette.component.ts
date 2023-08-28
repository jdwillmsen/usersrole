import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { PaletteColors } from '../../../shared/models/palette-colors.model';
import tinycolor from 'tinycolor2';
import { PaletteFormGroup } from '../../models/palette-form-group';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-create-palette',
  templateUrl: './create-palette.component.html',
  styleUrls: ['./create-palette.component.scss']
})
export class CreatePaletteComponent implements OnInit {
  @Input() paletteType: PaletteColors = 'primary';
  @Input() formGroupName!: string;
  darkTextColor: string;
  lightTextColor: string;
  colorDetailsBaseUrl = 'https://www.colorhexa.com/';
  paletteForm!: FormGroup;
  colorSelectionUpdate = new Subject<string>();

  colors = [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    'A100',
    'A200',
    'A400',
    'A700'
  ];

  lightTextIcon = 'wb_sunny';
  darkTextIcon = 'nightlight_round';
  colorSelection = '#000000';

  constructor(private rootFormGroup: FormGroupDirective) {
    const paletteGroup = new PaletteFormGroup();
    this.lightTextColor = paletteGroup.lightTextColor;
    this.darkTextColor = paletteGroup.darkTextColor;
    this.colorSelectionUpdate
      .pipe(debounceTime(250))
      .subscribe((value) => this.applyAlgorithm(value));
  }

  ngOnInit() {
    this.paletteForm = this.rootFormGroup.control.get(
      this.formGroupName
    ) as FormGroup;
  }

  reset() {
    this.paletteForm.reset();
    this.colorSelection = '#000000';
  }

  getTextIcon(currentColor: string) {
    if (currentColor === this.lightTextColor) {
      return this.lightTextIcon;
    } else {
      return this.darkTextIcon;
    }
  }

  toggleTextColor(control: AbstractControl | null) {
    if (control === null) return;
    if (control.value === this.lightTextColor) {
      control.setValue(this.darkTextColor);
    } else {
      control.setValue(this.lightTextColor);
    }
  }

  getColorsUrl(hexColor: string) {
    return this.colorDetailsBaseUrl + hexColor.replace('#', '');
  }

  applyAlgorithm(hexColor: string) {
    const color50 = tinycolor(hexColor).lighten(52);
    const color100 = tinycolor(hexColor).lighten(37);
    const color200 = tinycolor(hexColor).lighten(26);
    const color300 = tinycolor(hexColor).lighten(12);
    const color400 = tinycolor(hexColor).lighten(6);
    const color500 = tinycolor(hexColor).lighten(0);
    const color600 = tinycolor(hexColor).darken(6);
    const color700 = tinycolor(hexColor).darken(12);
    const color800 = tinycolor(hexColor).darken(18);
    const color900 = tinycolor(hexColor).darken(24);
    const colorA100 = tinycolor(hexColor).lighten(37).saturate(30);
    const colorA200 = tinycolor(hexColor).lighten(30).saturate(30);
    const colorA400 = tinycolor(hexColor).lighten(10).saturate(15);
    const colorA700 = tinycolor(hexColor).darken(5).saturate(5);

    this.paletteForm.get('color50')?.setValue(color50.toHexString());
    this.paletteForm.get('color100')?.setValue(color100.toHexString());
    this.paletteForm.get('color200')?.setValue(color200.toHexString());
    this.paletteForm.get('color300')?.setValue(color300.toHexString());
    this.paletteForm.get('color400')?.setValue(color400.toHexString());
    this.paletteForm.get('color500')?.setValue(color500.toHexString());
    this.paletteForm.get('color600')?.setValue(color600.toHexString());
    this.paletteForm.get('color700')?.setValue(color700.toHexString());
    this.paletteForm.get('color800')?.setValue(color800.toHexString());
    this.paletteForm.get('color900')?.setValue(color900.toHexString());
    this.paletteForm.get('colorA100')?.setValue(colorA100.toHexString());
    this.paletteForm.get('colorA200')?.setValue(colorA200.toHexString());
    this.paletteForm.get('colorA400')?.setValue(colorA400.toHexString());
    this.paletteForm.get('colorA700')?.setValue(colorA700.toHexString());

    this.paletteForm
      .get('colorContrast50')
      ?.setValue(this.getContrastColor(color50.isDark()));
    this.paletteForm
      .get('colorContrast200')
      ?.setValue(this.getContrastColor(color200.isDark()));
    this.paletteForm
      .get('colorContrast300')
      ?.setValue(this.getContrastColor(color300.isDark()));
    this.paletteForm
      .get('colorContrast400')
      ?.setValue(this.getContrastColor(color400.isDark()));
    this.paletteForm
      .get('colorContrast500')
      ?.setValue(this.getContrastColor(color500.isDark()));
    this.paletteForm
      .get('colorContrast600')
      ?.setValue(this.getContrastColor(color600.isDark()));
    this.paletteForm
      .get('colorContrast700')
      ?.setValue(this.getContrastColor(color700.isDark()));
    this.paletteForm
      .get('colorContrast800')
      ?.setValue(this.getContrastColor(color800.isDark()));
    this.paletteForm
      .get('colorContrast900')
      ?.setValue(this.getContrastColor(color900.isDark()));
    this.paletteForm
      .get('colorContrastA100')
      ?.setValue(this.getContrastColor(colorA100.isDark()));
    this.paletteForm
      .get('colorContrastA200')
      ?.setValue(this.getContrastColor(colorA200.isDark()));
    this.paletteForm
      .get('colorContrastA400')
      ?.setValue(this.getContrastColor(colorA400.isDark()));
    this.paletteForm
      .get('colorContrastA700')
      ?.setValue(this.getContrastColor(colorA700.isDark()));
  }

  private getContrastColor(isDark: boolean) {
    return isDark ? this.lightTextColor : this.darkTextColor;
  }
}
