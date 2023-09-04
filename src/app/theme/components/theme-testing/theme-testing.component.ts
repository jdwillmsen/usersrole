import { Component } from '@angular/core';
import { PaletteComponent } from '../palette/palette.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-theme-testing',
  templateUrl: './theme-testing.component.html',
  styleUrls: ['./theme-testing.component.scss'],
  standalone: true,
  imports: [NgFor, PaletteComponent]
})
export class ThemeTestingComponent {
  palettes = ['Primary', 'Accent', 'Success', 'Error', 'Info', 'Warn'];
}
