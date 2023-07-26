import { TestBed } from '@angular/core/testing';

import { ThemeStorageService } from './theme-storage.service';

describe('ThemeStorageService', () => {
  let service: ThemeStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
