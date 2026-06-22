import { Component, Input } from '@angular/core';
import { User } from 'firebase/auth';
import { SignOutComponent } from '../sign-out/sign-out.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgClass, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-profile-card',
    templateUrl: './profile-card.component.html',
    styleUrls: ['./profile-card.component.scss'],
    imports: [
        MatButtonModule,
        NgClass,
        MatMenuModule,
        NgIf,
        MatIconModule,
        MatDividerModule,
        SignOutComponent
    ]
})
export class ProfileCardComponent {
  @Input() user: User | undefined;

  checkForPhoto(url: string | null | undefined): boolean {
    return url == null;
  }
}
