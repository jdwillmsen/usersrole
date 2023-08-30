import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './components/home/home.component';

@NgModule({
    imports: [HomeRoutingModule, SharedModule, HomeComponent]
})
export class HomeModule {}
