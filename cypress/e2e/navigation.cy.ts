describe('Navigation', () => {
  before(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
  });

  after(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
  });

  describe('Basic Account', () => {
    before(() => {
      cy.login('basic').then(() => {
        cy.visit('/');
      });
    });

    after('should be able to sign out', () => {
      checkSignOut();
    });

    it('should have all the nav routes setup correctly', () => {
      cy.visit('/home');
      checkUserNavItems();
      cy.getByCy('expand-toggle-button').click();
      checkUserExpandedNavItems();
    });

    it('should have the nav route link to correct route', () => {
      cy.wait(15000); // To Avoid Limiter On Endpoints
      cy.visit('/home');
      checkUserRouteLinks();
    });

    it('should route the user to the appropriate link on home page tiles', () => {
      cy.wait(15000); // To Avoid Limiter On Endpoints
      cy.visit('/home');
      checkUserHomeTiles();
      cy.getByCy('users-tile').click();
      cy.url().should('include', '/forbidden');
      cy.getByCy('app-name').click();
      cy.getByCy('roles-tile').click();
      cy.url().should('include', '/forbidden');
      cy.getByCy('home-button').click();
      cy.url().should('include', '/home');
    });

    it('should bring use to the correct page on link visit', () => {
      cy.wait(15000); // To Avoid Limiter On Endpoints
      checkUserLinks();
      cy.visit('/admin/users');
      cy.url().should('include', '/forbidden');
      cy.visit('/admin/roles');
      cy.url().should('include', '/forbidden');
    });

    it('should be setup and work properly on small sizes', () => {
      checkSmallScreens();
    });
  });

  describe('Read Account', () => {
    before(() => {
      cy.login('read').then(() => {
        cy.visit('/');
      });
    });

    adminTests();
  });

  describe('Manager Account', () => {
    before(() => {
      cy.login('manager').then(() => {
        cy.visit('/');
      });
    });

    adminTests();
  });

  describe('Admin Account', () => {
    before(() => {
      cy.login('admin').then(() => {
        cy.visit('/');
      });
    });

    adminTests();
  });
});

function checkUserNavItems() {
  cy.getByCy('home-nav-item')
    .should('be.visible')
    .within(() => {
      cy.getByCy('nav-icon').should('be.visible');
      cy.getByCy('nav-title').should('not.exist');
    });
  cy.getByCy('profile-nav-item')
    .should('be.visible')
    .within(() => {
      cy.getByCy('nav-icon').should('be.visible');
      cy.getByCy('nav-title').should('not.exist');
    });
  cy.getByCy('alerts-nav-item')
    .should('be.visible')
    .within(() => {
      cy.getByCy('nav-icon').should('be.visible');
      cy.getByCy('nav-title').should('not.exist');
    });
  cy.getByCy('snackbars-nav-item')
    .should('be.visible')
    .within(() => {
      cy.getByCy('nav-icon').should('be.visible');
      cy.getByCy('nav-title').should('not.exist');
    });
  cy.getByCy('buttons-nav-item')
    .should('be.visible')
    .within(() => {
      cy.getByCy('nav-icon').should('be.visible');
      cy.getByCy('nav-title').should('not.exist');
    });
  cy.getByCy('palettes-nav-item')
    .should('be.visible')
    .within(() => {
      cy.getByCy('nav-icon').should('be.visible');
      cy.getByCy('nav-title').should('not.exist');
    });
  cy.getByCy('theme-nav-item')
    .should('be.visible')
    .within(() => {
      cy.getByCy('nav-icon').should('be.visible');
      cy.getByCy('nav-title').should('not.exist');
    });
}

function checkUserExpandedNavItems() {
  cy.getByCy('home-nav-item')
    .should('be.visible')
    .within(() => {
      cy.getByCy('nav-icon').should('be.visible');
      cy.getByCy('nav-title').should('be.visible').and('contain.text', 'Home');
    });
  cy.getByCy('profile-nav-item')
    .should('be.visible')
    .within(() => {
      cy.getByCy('nav-icon').should('be.visible');
      cy.getByCy('nav-title')
        .should('be.visible')
        .and('contain.text', 'Profile');
    });
  cy.getByCy('alerts-nav-item')
    .should('be.visible')
    .within(() => {
      cy.getByCy('nav-icon').should('be.visible');
      cy.getByCy('nav-title')
        .should('be.visible')
        .and('contain.text', 'Alerts');
    });
  cy.getByCy('snackbars-nav-item')
    .should('be.visible')
    .within(() => {
      cy.getByCy('nav-icon').should('be.visible');
      cy.getByCy('nav-title')
        .should('be.visible')
        .and('contain.text', 'Snackbars');
    });
  cy.getByCy('buttons-nav-item')
    .should('be.visible')
    .within(() => {
      cy.getByCy('nav-icon').should('be.visible');
      cy.getByCy('nav-title')
        .should('be.visible')
        .and('contain.text', 'Buttons');
    });
  cy.getByCy('palettes-nav-item')
    .should('be.visible')
    .within(() => {
      cy.getByCy('nav-icon').should('be.visible');
      cy.getByCy('nav-title')
        .should('be.visible')
        .and('contain.text', 'Palettes');
    });
  cy.getByCy('theme-nav-item')
    .should('be.visible')
    .within(() => {
      cy.getByCy('nav-icon').should('be.visible');
      cy.getByCy('nav-title').should('be.visible').and('contain.text', 'Theme');
    });
}

function checkUserRouteLinks() {
  cy.getByCy('home-nav-item').click();
  cy.url().should('include', '/home');
  cy.getByCy('profile-nav-item').click();
  cy.url().should('include', '/profile');
  cy.getByCy('alerts-nav-item').click();
  cy.url().should('include', '/testing/alerts');
  cy.getByCy('snackbars-nav-item').click();
  cy.url().should('include', '/testing/snackbars');
  cy.getByCy('buttons-nav-item').click();
  cy.url().should('include', '/testing/buttons');
  cy.getByCy('palettes-nav-item').click();
  cy.url().should('include', '/theme/view');
  cy.getByCy('theme-nav-item').click();
  cy.url().should('include', '/theme/create');
}

function checkUserHomeTiles() {
  cy.getByCy('home-tile').click();
  cy.url().should('include', '/home');
  cy.getByCy('profile-tile').click();
  cy.url().should('include', '/profile');
  cy.getByCy('app-name').click();
  cy.getByCy('alerts-tile').click();
  cy.url().should('include', '/testing/alerts');
  cy.getByCy('app-name').click();
  cy.getByCy('snackbars-tile').click();
  cy.url().should('include', '/testing/snackbars');
  cy.getByCy('app-name').click();
  cy.getByCy('buttons-tile').click();
  cy.url().should('include', '/testing/buttons');
  cy.getByCy('app-name').click();
  cy.getByCy('palettes-tile').click();
  cy.url().should('include', '/theme/view');
  cy.getByCy('app-name').click();
  cy.getByCy('theme-tile').click();
  cy.url().should('include', '/theme/create');
  cy.getByCy('app-name').click();
}

function checkUserLinks() {
  cy.visit('/');
  cy.url().should('include', '/home');
  cy.visit('/sign-in');
  cy.url().should('include', '/home');
  cy.visit('/not-a-valid-link');
  cy.url().should('include', '/home');
  cy.visit('/home');
  cy.url().should('include', '/home');
  cy.visit('/profile');
  cy.url().should('include', '/profile');
  cy.visit('/testing/alerts');
  cy.url().should('include', '/testing/alerts');
  cy.visit('/testing/snackbars');
  cy.url().should('include', '/testing/snackbars');
  cy.visit('/testing/buttons');
  cy.url().should('include', '/testing/buttons');
  cy.visit('/theme/view');
  cy.url().should('include', '/theme/view');
  cy.visit('/theme/create');
  cy.url().should('include', '/theme/create');
}

function checkAdminNavItems() {
  cy.getByCy('users-nav-item')
    .should('be.visible')
    .within(() => {
      cy.getByCy('nav-icon').should('be.visible');
      cy.getByCy('nav-title').should('not.exist');
    });
  cy.getByCy('roles-nav-item')
    .should('be.visible')
    .within(() => {
      cy.getByCy('nav-icon').should('be.visible');
      cy.getByCy('nav-title').should('not.exist');
    });
}

function checkAdminExpandedNavItems() {
  cy.getByCy('users-nav-item')
    .should('be.visible')
    .within(() => {
      cy.getByCy('nav-icon').should('be.visible');
      cy.getByCy('nav-title').should('be.visible').and('contain.text', 'Users');
    });
  cy.getByCy('roles-nav-item')
    .should('be.visible')
    .within(() => {
      cy.getByCy('nav-icon').should('be.visible');
      cy.getByCy('nav-title').should('be.visible').and('contain.text', 'Roles');
    });
}

function checkAdminRouteLinks() {
  cy.getByCy('users-nav-item').click();
  cy.url().should('include', '/admin/users');
  cy.getByCy('roles-nav-item').click();
  cy.url().should('include', '/admin/roles');
}

function checkAdminHomeTiles() {
  cy.getByCy('users-tile').click();
  cy.url().should('include', '/admin/users');
  cy.getByCy('app-name').click();
  cy.getByCy('roles-tile').click();
  cy.url().should('include', '/admin/roles');
}

function checkAdminLinks() {
  cy.visit('/admin/users');
  cy.url().should('include', '/admin/users');
  cy.visit('/admin/roles');
  cy.url().should('include', '/admin/roles');
}

function checkSignOut() {
  cy.visit('/home');
  cy.getByCy('profile-icon-button').click();
  cy.getByCy('sign-out').click();
  cy.url().should('include', '/sign-in');
  cy.getByCy('snackbar-container')
    .should('be.visible')
    .within(() => {
      cy.getByCy('message').should('contain.text', 'Logout Successful');
    });
}

function checkSmallScreens() {
  cy.viewport(300, 600);
  cy.visit('/home');
  cy.getByCy('sidenav-links-list').should('not.be.visible');
  cy.getByCy('nav-button').click();
  cy.getByCy('sidenav-links-list').should('be.visible');
  cy.get('.mat-drawer-backdrop').click({ force: true });
  cy.getByCy('sidenav-links-list').should('not.be.visible');
  cy.getByCy('nav-button').click();
  cy.getByCy('sidenav-links-list').should('be.visible');
  cy.getByCy('nav-button').click();
  cy.getByCy('sidenav-links-list').should('not.be.visible');
  cy.getByCy('nav-button').click();
  checkUserExpandedNavItems();
}

function adminTests() {
  after('should be able to sign out', () => {
    checkSignOut();
  });

  it('should have all the nav routes setup correctly', () => {
    cy.visit('/home');
    checkUserNavItems();
    checkAdminNavItems();
    cy.getByCy('expand-toggle-button').click();
    checkUserExpandedNavItems();
    checkAdminExpandedNavItems();
  });

  it('should have the nav route link to correct route', () => {
    cy.wait(15000); // To Avoid Limiter On Endpoints
    cy.visit('/home');
    checkUserRouteLinks();
    checkAdminRouteLinks();
  });

  it('should route the user to the appropriate link on home page tiles', () => {
    cy.wait(15000); // To Avoid Limiter On Endpoints
    cy.visit('/home');
    checkUserHomeTiles();
    checkAdminHomeTiles();
  });

  it('should bring use to the correct page on link visit', () => {
    cy.wait(15000); // To Avoid Limiter On Endpoints
    checkUserLinks();
    checkAdminLinks();
  });

  it('should be setup and work properly on small sizes', () => {
    checkSmallScreens();
    checkAdminExpandedNavItems();
  });
}
