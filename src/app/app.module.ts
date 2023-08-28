import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { A11yModule } from '@angular/cdk/a11y';

import { AppMaterialModule } from './shared/app-material.module';
import { AppFirebaseModule } from './core/app-firebase.module';
import { AgGridModule } from 'ag-grid-angular';

import { AuthService } from './core/services/auth/auth.service';
import { AuthTokenHttpInterceptorProvider } from './core/interceptors/auth-token.interceptor';

import { AppComponent } from './app.component';
import { NavItemComponent } from './shared/components/nav-item/nav-item.component';
import { HomeComponent } from './home/components/home/home.component';
import { SignInComponent } from './authentication/components/sign-in/sign-in.component';
import { SignOutComponent } from './shared/components/sign-out/sign-out.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { MainComponent } from './shared/components/main/main.component';
import { ProfileCardComponent } from './shared/components/profile-card/profile-card.component';
import { EmailSignInComponent } from './authentication/components/email-sign-in/email-sign-in.component';
import { UsersComponent } from './admin/components/users/users.component';
import { UserFormComponent } from './admin/components/user-form/user-form.component';
import { ProfileComponent } from './home/components/profile/profile.component';
import { SignUpComponent } from './authentication/components/sign-up/sign-up.component';
import { SnackbarComponent } from './shared/components/snackbar/snackbar.component';
import { ThemeSelectorComponent } from './shared/components/theme-selector/theme-selector.component';
import { AlertComponent } from './shared/components/alert/alert.component';
import { AlertTestingComponent } from './testing/components/alert-testing/alert-testing.component';
import { ButtonsTestingComponent } from './testing/components/buttons-testing/buttons-testing.component';
import { SnackbarTestingComponent } from './testing/components/snackbar-testing/snackbar-testing.component';
import { RolesComponent } from './admin/components/roles/roles.component';
import { ActionsButtonCellRendererComponent } from './admin/components/actions-button-cell-renderer/actions-button-cell-renderer.component';
import { RolesCellRendererComponent } from './admin/components/roles-cell-renderer/roles-cell-renderer.component';
import { ThemeTestingComponent } from './theme/components/theme-testing/theme-testing.component';
import { PaletteComponent } from './theme/components/palette/palette.component';
import { CreateThemeComponent } from './theme/components/create-theme/create-theme.component';
import { CreatePaletteComponent } from './theme/components/create-palette/create-palette.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    AgGridModule,

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
    SignUpComponent,
    SnackbarComponent,
    ThemeSelectorComponent,
    AlertComponent,
    AlertTestingComponent,
    ButtonsTestingComponent,
    SnackbarTestingComponent,
    RolesComponent,
    ActionsButtonCellRendererComponent,
    RolesCellRendererComponent,
    ThemeTestingComponent,
    PaletteComponent,
    CreateThemeComponent,
    CreatePaletteComponent
  ],
  bootstrap: [AppComponent],
  providers: [AuthService, AuthTokenHttpInterceptorProvider],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
