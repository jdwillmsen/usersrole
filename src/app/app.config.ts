import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  isDevMode
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AdminModule } from './admin/admin.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { HomeModule } from './home/home.module';
import { ProfileModule } from './profile/profile.module';
import { TestingModule } from './testing/testing.module';
import { ThemeModule } from './theme/theme.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { ErrorHandlerService } from './core/services/error-handler/error-handler.service';

export const appConfig: ApplicationConfig = {
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
    provideAnimations(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService
    }
  ]
};
