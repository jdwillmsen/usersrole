import { AngularFireAuthGuard, canActivate } from '@angular/fire/compat/auth-guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UploadComponent } from './components/upload/upload.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignInGuard } from './guards/sign-in.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AngularFireAuthGuard]
  },
  {
    path: 'upload',
    component: UploadComponent,
    canActivate: [AngularFireAuthGuard]
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [SignInGuard]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
