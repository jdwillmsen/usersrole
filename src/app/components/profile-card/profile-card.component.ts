import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
  @Input() user!: firebase.User;

  constructor(public authService: AuthService) { }
  
  checkForPhoto(url: string | null): boolean {
    return url == null;
  }

}
