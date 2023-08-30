import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from './app-material.module';
import { A11yModule } from '@angular/cdk/a11y';
import { AlertComponent } from './components/alert/alert.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { NavItemComponent } from './components/nav-item/nav-item.component';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { SignOutComponent } from './components/sign-out/sign-out.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { ThemeSelectorComponent } from './components/theme-selector/theme-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { RouterLink, RouterLinkActive } from '@angular/router';

@NgModule({
  declarations: [
    AlertComponent,
    HeaderComponent,
    MainComponent,
    NavItemComponent,
    ProfileCardComponent,
    SignOutComponent,
    SnackbarComponent,
    ThemeSelectorComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    A11yModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    RouterLink,
    RouterLinkActive
  ],
  exports: [
    CommonModule,
    AppMaterialModule,
    A11yModule,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
    HeaderComponent,
    MainComponent,
    NavItemComponent,
    ProfileCardComponent,
    SignOutComponent,
    SnackbarComponent,
    ThemeSelectorComponent,
    RouterLink,
    RouterLinkActive
  ]
})
export class SharedModule {}
