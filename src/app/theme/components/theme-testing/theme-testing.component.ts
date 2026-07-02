import { Component } from '@angular/core';
import { PaletteComponent } from '../palette/palette.component';

@Component({
  selector: 'app-theme-testing',
  templateUrl: './theme-testing.component.html',
  styleUrls: ['./theme-testing.component.scss'],
  imports: [PaletteComponent]
})
export class ThemeTestingComponent {
  palettes = ['Primary', 'Accent', 'Success', 'Error', 'Info', 'Warn'];
}
