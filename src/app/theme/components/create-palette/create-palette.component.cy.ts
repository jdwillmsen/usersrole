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
  describe('Setup Properly', () => {
    it('should be setup properly for primary', () => {
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
      testSetupProperly('Primary');
    });

    it('should be setup properly for accent', () => {
      cy.mount(CreatePaletteComponent, {
        providers: [
          {
            provide: FormGroupDirective,
            useValue: {
              control: new FormGroup({
                accentPalette: new FormGroup(
                  new PaletteFormGroup().paletteFormGroup
                )
              })
            }
          }
        ],
        componentProperties: {
          paletteType: 'accent',
          formGroupName: 'accentPalette'
        }
      });
      testSetupProperly('Accent');
    });

    it('should be setup properly for info', () => {
      cy.mount(CreatePaletteComponent, {
        providers: [
          {
            provide: FormGroupDirective,
            useValue: {
              control: new FormGroup({
                infoPalette: new FormGroup(
                  new PaletteFormGroup().paletteFormGroup
                )
              })
            }
          }
        ],
        componentProperties: {
          paletteType: 'info',
          formGroupName: 'infoPalette'
        }
      });
      testSetupProperly('Info');
    });

    it('should be setup properly for error', () => {
      cy.mount(CreatePaletteComponent, {
        providers: [
          {
            provide: FormGroupDirective,
            useValue: {
              control: new FormGroup({
                errorPalette: new FormGroup(
                  new PaletteFormGroup().paletteFormGroup
                )
              })
            }
          }
        ],
        componentProperties: {
          paletteType: 'error',
          formGroupName: 'errorPalette'
        }
      });
      testSetupProperly('Error');
    });

    it('should be setup properly for success', () => {
      cy.mount(CreatePaletteComponent, {
        providers: [
          {
            provide: FormGroupDirective,
            useValue: {
              control: new FormGroup({
                successPalette: new FormGroup(
                  new PaletteFormGroup().paletteFormGroup
                )
              })
            }
          }
        ],
        componentProperties: {
          paletteType: 'success',
          formGroupName: 'successPalette'
        }
      });
      testSetupProperly('Success');
    });

    it('should be setup properly for warn', () => {
      cy.mount(CreatePaletteComponent, {
        providers: [
          {
            provide: FormGroupDirective,
            useValue: {
              control: new FormGroup({
                warnPalette: new FormGroup(
                  new PaletteFormGroup().paletteFormGroup
                )
              })
            }
          }
        ],
        componentProperties: {
          paletteType: 'warn',
          formGroupName: 'warnPalette'
        }
      });
      testSetupProperly('Warn');
    });
  });

  it('should behave appropriately when changing color(s)', () => {
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
    changeColor('main', '#ff0000');
    checkColor('50', '#ffffff');
    checkColor('100', '#ffbdbd');
    checkColor('200', '#ff8585');
    checkColor('300', '#ff3d3d');
    checkColor('400', '#ff1f1f');
    checkColor('500', '#ff0000');
    checkColor('600', '#e00000');
    checkColor('700', '#c20000');
    checkColor('800', '#a30000');
    checkColor('900', '#850000');
    checkColor('A100', '#ffbdbd');
    checkColor('A200', '#ff9999');
    checkColor('A400', '#ff3333');
    checkColor('A700', '#e60000');
    cy.getByCy('restore-button').click();
    cy.getByCy('main-color-input').should('contain.value', '#000000');
    checkDefaultColors();
    changeAndCheckColor('50', '#fffffe');
    changeAndCheckColor('100', '#ffbdbc');
    changeAndCheckColor('200', '#ff8584');
    changeAndCheckColor('300', '#ff3d3c');
    changeAndCheckColor('400', '#ff1f1e');
    changeAndCheckColor('500', '#fe0000');
    changeAndCheckColor('600', '#d00000');
    changeAndCheckColor('700', '#c10000');
    changeAndCheckColor('800', '#a20000');
    changeAndCheckColor('900', '#840000');
    changeAndCheckColor('A100', '#ffbdbc');
    changeAndCheckColor('A200', '#ff9998');
    changeAndCheckColor('A400', '#ff3333');
    changeAndCheckColor('A700', '#e50000');
    changeColor('main', '#dd00dd');
    checkColor('50', '#ffe7ff');
    checkColor('100', '#ff9bff');
    checkColor('200', '#ff63ff');
    checkColor('300', '#ff1bff');
    checkColor('400', '#fc00fc');
    checkColor('500', '#dd00dd');
    checkColor('600', '#be00be');
    checkColor('700', '#a000a0');
    checkColor('800', '#810081');
    checkColor('900', '#630063');
    checkColor('A100', '#ff9bff');
    checkColor('A200', '#ff77ff');
    checkColor('A400', '#ff11ff');
    checkColor('A700', '#c300c3');
  });

  it('should behave appropriately when changing contrast color(s)', () => {
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
    testContrastColor('50', false);
    testContrastColor('100', false);
    testContrastColor('200', false);
    testContrastColor('300', false);
    testContrastColor('400', false);
    testContrastColor('500', false);
    testContrastColor('600', true);
    testContrastColor('700', true);
    testContrastColor('800', true);
    testContrastColor('900', true);
    testContrastColor('A100', false);
    testContrastColor('A200', false);
    testContrastColor('A400', false);
    testContrastColor('A700', true);
    cy.getByCy('restore-button').click();
    cy.getByCy(`50-color`).should('have.css', 'color', 'rgb(0, 0, 0)');
    cy.getByCy(`100-color`).should('have.css', 'color', 'rgb(0, 0, 0)');
    cy.getByCy(`200-color`).should('have.css', 'color', 'rgb(0, 0, 0)');
    cy.getByCy(`300-color`).should('have.css', 'color', 'rgb(0, 0, 0)');
    cy.getByCy(`400-color`).should('have.css', 'color', 'rgb(0, 0, 0)');
    cy.getByCy(`500-color`).should('have.css', 'color', 'rgb(0, 0, 0)');
    cy.getByCy(`600-color`).should('have.css', 'color', 'rgb(255, 255, 255)');
    cy.getByCy(`700-color`).should('have.css', 'color', 'rgb(255, 255, 255)');
    cy.getByCy(`800-color`).should('have.css', 'color', 'rgb(255, 255, 255)');
    cy.getByCy(`900-color`).should('have.css', 'color', 'rgb(255, 255, 255)');
    cy.getByCy(`A100-color`).should('have.css', 'color', 'rgb(0, 0, 0)');
    cy.getByCy(`A200-color`).should('have.css', 'color', 'rgb(0, 0, 0)');
    cy.getByCy(`A400-color`).should('have.css', 'color', 'rgb(0, 0, 0)');
    cy.getByCy(`A700-color`).should('have.css', 'color', 'rgb(255, 255, 255)');
  });
});

function checkPaletteRow(colorSelectorNumber: string, colorValue: string) {
  cy.getByCy(`${colorSelectorNumber}-color`)
    .should('be.visible')
    .and('contain.text', colorSelectorNumber);
  cy.getByCy(`${colorSelectorNumber}-color-value`)
    .should('be.visible')
    .and('contain.text', `${colorValue}`);
  cy.getByCy(`${colorSelectorNumber}-color-link`)
    .should('be.visible')
    .trigger('mouseenter');
  cy.contains('Open Color Details');
  cy.getByCy(`${colorSelectorNumber}-color-link`).trigger('mouseleave');
  cy.getByCy(`${colorSelectorNumber}-color-contrast-button`)
    .should('be.visible')
    .and('be.enabled')
    .trigger('mouseenter');
  cy.contains('Toggle Contrast');
  cy.getByCy(`${colorSelectorNumber}-color-contrast-button`).trigger(
    'mouseleave'
  );
  cy.getByCy(`${colorSelectorNumber}-color-input`)
    .should('be.enabled')
    .and('contain.value', `${colorValue}`)
    .trigger('mouseenter');
  cy.contains('Select Color');
  cy.getByCy(`${colorSelectorNumber}-color-input`).trigger('mouseleave');
}

function testSetupProperly(title: string) {
  cy.getByCy('title').should('be.visible').and('contain.text', title);
  cy.getByCy('restore-button')
    .should('be.visible')
    .and('be.enabled')
    .trigger('mouseenter');
  cy.contains('Restore Defaults');
  cy.getByCy('restore-button').trigger('mouseleave');
  cy.getByCy('main-color-input')
    .should('be.visible')
    .and('be.enabled')
    .and('contain.value', '#000000')
    .trigger('mouseenter');
  cy.contains('Select Color');
  cy.getByCy('main-color-input').trigger('mouseleave');
  checkPaletteRow('50', '#ffffff');
  checkPaletteRow('100', '#dedede');
  checkPaletteRow('200', '#c2c2c2');
  checkPaletteRow('300', '#9f9f9f');
  checkPaletteRow('400', '#8f8f8f');
  checkPaletteRow('500', '#808080');
  checkPaletteRow('600', '#717171');
  checkPaletteRow('700', '#616161');
  checkPaletteRow('800', '#525252');
  checkPaletteRow('900', '#434343');
  checkPaletteRow('A100', '#eeeeee');
  checkPaletteRow('A200', '#c3c1c3');
  checkPaletteRow('A400', '#909090');
  checkPaletteRow('A700', '#535353');
}

function changeColor(colorSelectorNumber: string, colorValue: string) {
  cy.getByCy(`${colorSelectorNumber}-color-input`)
    .click()
    .invoke('val', colorValue.toLowerCase())
    .trigger('input')
    .blur();
}

function checkColor(colorSelectorNumber: string, colorValue: string) {
  cy.getByCy(`${colorSelectorNumber}-color-value`).and(
    'contain.text',
    `${colorValue}`
  );
  cy.getByCy(`${colorSelectorNumber}-color-input`).and(
    'contain.value',
    `${colorValue}`
  );
}

function changeAndCheckColor(colorSelectorNumber: string, colorValue: string) {
  changeColor(colorSelectorNumber, colorValue);
  checkColor(colorSelectorNumber, colorValue);
}

function checkDefaultColors() {
  checkColor('50', '#ffffff');
  checkColor('100', '#dedede');
  checkColor('200', '#c2c2c2');
  checkColor('300', '#9f9f9f');
  checkColor('400', '#8f8f8f');
  checkColor('500', '#808080');
  checkColor('600', '#717171');
  checkColor('700', '#616161');
  checkColor('800', '#525252');
  checkColor('900', '#434343');
  checkColor('A100', '#eeeeee');
  checkColor('A200', '#c3c1c3');
  checkColor('A400', '#909090');
  checkColor('A700', '#535353');
}

function testContrastColor(colorSelectorNumber: string, isLight = false) {
  if (isLight) {
    cy.getByCy(`${colorSelectorNumber}-color`).should(
      'have.css',
      'color',
      'rgb(255, 255, 255)'
    );
    cy.getByCy(`${colorSelectorNumber}-color-contrast-button`).click().blur();
    cy.getByCy(`${colorSelectorNumber}-color`).should(
      'have.css',
      'color',
      'rgb(0, 0, 0)'
    );
  } else {
    cy.getByCy(`${colorSelectorNumber}-color`).should(
      'have.css',
      'color',
      'rgb(0, 0, 0)'
    );
    cy.getByCy(`${colorSelectorNumber}-color-contrast-button`).click().blur();
    cy.getByCy(`${colorSelectorNumber}-color`).should(
      'have.css',
      'color',
      'rgb(255, 255, 255)'
    );
  }
}
