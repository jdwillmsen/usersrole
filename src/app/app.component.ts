import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from './shared/components/main/main.component';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [HeaderComponent, MainComponent, RouterOutlet]
})
export class AppComponent {}
