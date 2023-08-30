import { NgModule } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [ProfileRoutingModule, SharedModule]
})
export class ProfileModule {}
