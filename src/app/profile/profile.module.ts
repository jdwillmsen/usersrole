import { NgModule } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';

import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  imports: [ProfileRoutingModule, ProfileComponent]
})
export class ProfileModule {}
