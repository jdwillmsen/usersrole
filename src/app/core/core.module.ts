import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppFirebaseModule } from './app-firebase.module';
import { AuthService } from './services/auth/auth.service';
import { SnackbarService } from './services/snackbar/snackbar.service';
import { PermissionsService } from './services/permissions/permissions.service';
import { AlertService } from './services/alert/alert.service';
import { UsersService } from './services/users/users.service';
import { StyleManagerService } from './services/style-manager/style-manager.service';
import { AuthTokenHttpInterceptorProvider } from './interceptors/auth-token.interceptor';
import { FirestoreService } from './services/firestore/firestore.service';

@NgModule({
  imports: [AppFirebaseModule, HttpClientModule],
  providers: [
    AuthService,
    SnackbarService,
    PermissionsService,
    AlertService,
    UsersService,
    StyleManagerService,
    FirestoreService,
    AuthTokenHttpInterceptorProvider
  ],
  exports: [AppFirebaseModule, HttpClientModule]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('You should import core module only in the root module');
    }
  }
}
