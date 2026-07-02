import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThemeTestingComponent } from './components/theme-testing/theme-testing.component';
import { CreateThemeComponent } from './components/create-theme/create-theme.component';
import { authGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'
  },
  {
    path: 'view',
    component: ThemeTestingComponent,
    canActivate: [authGuard]
  },
  {
    path: 'create',
    component: CreateThemeComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeRoutingModule {}
