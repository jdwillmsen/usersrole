import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TestingRoutingModule } from './testing-routing.module';
import { AlertTestingComponent } from './components/alert-testing/alert-testing.component';
import { ButtonsTestingComponent } from './components/buttons-testing/buttons-testing.component';
import { SnackbarTestingComponent } from './components/snackbar-testing/snackbar-testing.component';

@NgModule({
  declarations: [
    AlertTestingComponent,
    ButtonsTestingComponent,
    SnackbarTestingComponent
  ],
  imports: [TestingRoutingModule, SharedModule]
})
export class TestingModule {}
