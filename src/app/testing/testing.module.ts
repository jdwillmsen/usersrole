import { NgModule } from '@angular/core';

import { TestingRoutingModule } from './testing-routing.module';
import { AlertTestingComponent } from './components/alert-testing/alert-testing.component';
import { ButtonsTestingComponent } from './components/buttons-testing/buttons-testing.component';
import { SnackbarTestingComponent } from './components/snackbar-testing/snackbar-testing.component';

@NgModule({
  imports: [
    TestingRoutingModule,
    AlertTestingComponent,
    ButtonsTestingComponent,
    SnackbarTestingComponent
  ]
})
export class TestingModule {}
