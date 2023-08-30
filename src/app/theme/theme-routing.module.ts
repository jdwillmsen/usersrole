import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThemeTestingComponent } from './components/theme-testing/theme-testing.component';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { CreateThemeComponent } from './components/create-theme/create-theme.component';
import { redirectUnauthorizedToLogin } from '../app-routing.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'
  },
  {
    path: 'view',
    component: ThemeTestingComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  },
  {
    path: 'create',
    component: CreateThemeComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeRoutingModule {}
