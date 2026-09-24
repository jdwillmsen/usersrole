// Committed on purpose: nothing here is a secret. The demo- project prefix
// makes the Emulator Suite refuse to reach any real Google Cloud project.
export const environment = {
  production: false,
  useEmulators: true,
  functionsBaseUrl: 'http://127.0.0.1:5001/demo-usersrole/us-central1',
  firebase: {
    apiKey: 'demo-api-key',
    authDomain: 'demo-usersrole.firebaseapp.com',
    projectId: 'demo-usersrole',
    storageBucket: 'demo-usersrole.appspot.com',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  },
  recaptcha: {
    siteKey: ''
  }
};
