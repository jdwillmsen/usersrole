import { FirestoreService } from './firestore.service';
import { expect } from '@jest/globals';

describe('FirestoreService', () => {
  let firestoreService: FirestoreService;
  const firestoreMock: jest.Mocked<any> = {
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn()
  };

  beforeEach(() => {
    firestoreService = new FirestoreService(firestoreMock);
  });

  it('should create an instance of FirestoreService', () => {
    expect(firestoreService).toBeInstanceOf(FirestoreService);
  });

  /* All other testing needs to be covered by e2e / component as there is no
  unit test / mocking tools available */
});
