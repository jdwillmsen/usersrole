import { TestBed } from '@angular/core/testing';

import { NavItemComponent } from './nav-item.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('NavItemComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({
      declarations: [NavItemComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    const fixture = TestBed.createComponent(NavItemComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
