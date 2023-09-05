import { CreatePaletteComponent } from './create-palette.component';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { PaletteFormGroup } from '../../models/palette-form-group';

describe('CreatePaletteComponent', () => {
  it('should mount', () => {
    cy.mount(CreatePaletteComponent, {
      providers: [
        {
          provide: FormGroupDirective,
          useValue: {
            control: new FormGroup({
              primaryPalette: new FormGroup(
                new PaletteFormGroup().paletteFormGroup
              )
            })
          }
        }
      ],
      componentProperties: {
        paletteType: 'primary',
        formGroupName: 'primaryPalette'
      }
    });
  });
});
