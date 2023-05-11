import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { A11yModule } from '@angular/cdk/a11y';

import {
  ScreenTrackingService,
  UserTrackingService
} from '@angular/fire/analytics';

import { AppMaterialModule } from './modules/app-material.module';
import { AppFirebaseModule } from './modules/app-firebase.module';

import { AppComponent } from './app.component';
import { NavItemComponent } from './components/nav-item/nav-item.component';
import { HomeComponent } from './components/home/home.component';
import { UploadComponent } from './components/upload/upload.component';
import { SignInComponent } from './components/sign-in/sign-in.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
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
    UploadComponent,
    SignInComponent
  ],
  bootstrap: [AppComponent],
  providers: [ScreenTrackingService, UserTrackingService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
