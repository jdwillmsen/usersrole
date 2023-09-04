import { TestBed } from '@angular/core/testing';

import { UserFormService } from './user-form.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('UserFormService', () => {
  let service: UserFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule]
    });
    service = TestBed.inject(UserFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
