import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ThemeModule } from './app/theme/theme.module';
import { TestingModule } from './app/testing/testing.module';
import { ProfileModule } from './app/profile/profile.module';
import { HomeModule } from './app/home/home.module';
import { AuthenticationModule } from './app/authentication/authentication.module';
import { AdminModule } from './app/admin/admin.module';
import { CoreModule } from './app/core/core.module';
import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      CoreModule,
      AdminModule,
      AuthenticationModule,
      HomeModule,
      ProfileModule,
      TestingModule,
      ThemeModule,
      MatSnackBarModule
    ),
    provideAnimations()
  ]
}).catch((err) => console.error(err));
