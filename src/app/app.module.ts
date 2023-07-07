import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { A11yModule } from '@angular/cdk/a11y';

import { AppMaterialModule } from './modules/app-material.module';
import { AppFirebaseModule } from './modules/app-firebase.module';

import {
  ScreenTrackingService,
  UserTrackingService
} from '@angular/fire/analytics';
import { AuthService } from './services/auth.service';
import { AuthTokenHttpInterceptorProvider } from './interceptors/auth-token.interceptor';

import { AppComponent } from './app.component';
import { NavItemComponent } from './components/nav-item/nav-item.component';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignOutComponent } from './components/sign-out/sign-out.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { EmailSignInComponent } from './components/email-sign-in/email-sign-in.component';
import { UsersComponent } from './components/users/users.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,

    // CDK
    A11yModule,

    // Material
    AppMaterialModule,

    // Firebase
    AppFirebaseModule
  ],
  declarations: [
    AppComponent,
    NavItemComponent,
    HomeComponent,
    SignInComponent,
    SignOutComponent,
    HeaderComponent,
    MainComponent,
    ProfileCardComponent,
    EmailSignInComponent,
    UsersComponent,
    UserFormComponent,
    ProfileComponent,
    SignUpComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    AuthService,
    AuthTokenHttpInterceptorProvider
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
