import { Component } from '@angular/core';

@Component({
  selector: 'app-theme-testing',
  templateUrl: './theme-testing.component.html',
  styleUrls: ['./theme-testing.component.scss']
})
export class ThemeTestingComponent {
  palettes = ['Primary', 'Accent', 'Success', 'Error', 'Info', 'Warn'];
}
