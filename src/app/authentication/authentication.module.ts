import { NgModule } from '@angular/core';
import { AuthenticationRoutingModule } from './authentication-routing.module';

import { EmailSignInComponent } from './components/email-sign-in/email-sign-in.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

@NgModule({
  imports: [
    AuthenticationRoutingModule,
    EmailSignInComponent,
    SignInComponent,
    SignUpComponent
]
})
export class AuthenticationModule {}
