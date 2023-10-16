import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-github-button',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './github-button.component.html',
  styleUrls: ['./github-button.component.scss']
})
export class GithubButtonComponent {
  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'github-logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/github-icon.svg'
      )
    );
  }
}
