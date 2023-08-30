import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './components/home/home.component';

@NgModule({
    imports: [HomeRoutingModule, HomeComponent]
})
export class HomeModule {}
