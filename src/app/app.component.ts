import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from './shared/components/main/main.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { MatDrawerMode } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [HeaderComponent, MainComponent, RouterOutlet]
})
export class AppComponent {
  sideNavMode = signal<MatDrawerMode>('side');
  isSideNavOpened = signal(true);
  isXSmallScreen = signal(false);

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe(Breakpoints.XSmall).subscribe((result) => {
      this.isXSmallScreen.set(result.matches);
      this.updateNavigationBasedOnScreenSize();
    });
  }

  handleToggle() {
    this.isSideNavOpened.set(!this.isSideNavOpened());
  }

  sideNavChange(isOpen: boolean) {
    this.isSideNavOpened.set(isOpen);
  }

  private updateNavigationBasedOnScreenSize() {
    if (this.isXSmallScreen()) {
      this.sideNavMode.set('over');
      this.isSideNavOpened.set(false);
    } else {
      this.sideNavMode.set('side');
      this.isSideNavOpened.set(true);
    }
  }
}
