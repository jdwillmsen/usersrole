describe('Theme', () => {
  before(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
  });

  after(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
  });

  it('should be able to change themes', () => {});
});
