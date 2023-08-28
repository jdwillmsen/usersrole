import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { SnackbarService } from './services/snackbar/snackbar.service';
import { PermissionsService } from './services/permissions/permissions.service';
import { AlertService } from './services/alert/alert.service';
import { UsersService } from './services/users/users.service';
import { AuthTokenHttpInterceptorProvider } from './interceptors/auth-token.interceptor';
import { AppFirebaseModule } from './app-firebase.module';

@NgModule({
  imports: [AppFirebaseModule],
  providers: [
    AuthService,
    SnackbarService,
    PermissionsService,
    AlertService,
    UsersService,
    AuthTokenHttpInterceptorProvider
  ],
  exports: [AppFirebaseModule]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('You should import core module only in the root module');
    }
  }
}
