import { TestBed } from '@angular/core/testing';
import { FirestoreService } from './firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../../../../environments/environment';

describe('FirestoreService', () => {
  let service: FirestoreService;
  let angularFirestoreMock: Partial<AngularFirestore>;

  beforeEach(() => {
    angularFirestoreMock = {
      doc: jest.fn(),
      collection: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [
        provideFirestore(() => getFirestore()),
        provideFirebaseApp(() => initializeApp(environment.firebase))
      ],
      providers: [
        FirestoreService,
        { provide: AngularFirestore, useValue: angularFirestoreMock }
      ]
    });
    service = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
