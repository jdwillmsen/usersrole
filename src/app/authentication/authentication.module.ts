import { NgModule } from '@angular/core';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { SharedModule } from '../shared/shared.module';
import { EmailSignInComponent } from './components/email-sign-in/email-sign-in.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

@NgModule({
  declarations: [EmailSignInComponent, SignInComponent, SignUpComponent],
  imports: [AuthenticationRoutingModule, SharedModule]
})
export class AuthenticationModule {}
