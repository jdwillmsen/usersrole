import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-buttons-testing',
  templateUrl: './buttons-testing.component.html',
  styleUrls: ['./buttons-testing.component.scss'],
  imports: [MatButtonModule, RouterLink, MatIconModule]
})
export class ButtonsTestingComponent {}
