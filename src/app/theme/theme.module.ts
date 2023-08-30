import { NgModule } from '@angular/core';

import { ThemeRoutingModule } from './theme-routing.module';
import { FirestoreService } from './services/firestore/firestore.service';
import { ThemeStorageService } from './services/theme-storage/theme-storage.service';
import { CreatePaletteComponent } from './components/create-palette/create-palette.component';
import { CreateThemeComponent } from './components/create-theme/create-theme.component';
import { PaletteComponent } from './components/palette/palette.component';
import { ThemeTestingComponent } from './components/theme-testing/theme-testing.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CreatePaletteComponent,
    CreateThemeComponent,
    PaletteComponent,
    ThemeTestingComponent
  ],
  imports: [ThemeRoutingModule, SharedModule],
  providers: [FirestoreService, ThemeStorageService]
})
export class ThemeModule {}
