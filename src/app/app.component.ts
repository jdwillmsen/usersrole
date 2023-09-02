import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from './shared/components/main/main.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { MatDrawerMode } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [HeaderComponent, MainComponent, RouterOutlet]
})
export class AppComponent {
  sideNavMode: MatDrawerMode = 'side';
  isSideNavOpened = true;
  isXSmallScreen = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe(Breakpoints.XSmall).subscribe((result) => {
      this.isXSmallScreen = result.matches;
      this.updateNavigationBasedOnScreenSize();
    });
  }

  handleToggle() {
    this.isSideNavOpened = !this.isSideNavOpened;
  }

  onSideNavChange(isOpen: boolean) {
    this.isSideNavOpened = isOpen;
  }

  private updateNavigationBasedOnScreenSize() {
    if (this.isXSmallScreen) {
      this.sideNavMode = 'over';
      this.isSideNavOpened = false;
    } else {
      this.sideNavMode = 'side';
      this.isSideNavOpened = true;
    }
  }
}
