describe('Theme', () => {
  before(() => {
    cy.clearFirebaseLocal();
  });

  after(() => {
    cy.clearFirebaseLocal();
  });

  describe('Theme Account', () => {
    before(() => {
      cy.createThemeUser();
      cy.fixture('theme-user').then((user) => {
        cy.loginWithUser(user.email, user.password).then(() => {
          cy.visit('/');
        });
      });
    });

    after(() => {
      cy.deleteThemeUser();
    });

    it('should be able to change themes', () => {
      cy.visit('/theme/view');
      cy.getByCy('theme-selector').click();
      cy.getByCy('black-white-button').click();
      cy.getByCy('navbar-header').should(
        'have.css',
        'background-color',
        'rgb(0, 0, 0)'
      );
      cy.getByCy('theme-selector').click();
      cy.getByCy('deeppurple-amber-button').click();
      cy.getByCy('navbar-header').should(
        'have.css',
        'background-color',
        'rgb(103, 58, 183)'
      );
      cy.getByCy('theme-selector').click();
      cy.getByCy('indigo-pink-button').click();
      cy.getByCy('navbar-header').should(
        'have.css',
        'background-color',
        'rgb(63, 81, 181)'
      );
      cy.getByCy('theme-selector').click();
      cy.getByCy('custom-light-button').click();
      cy.wait(500); // Waiting for dynamic theme to be applied
      cy.getByCy('navbar-header').should(
        'have.css',
        'background-color',
        'rgb(125, 207, 42)'
      );
      cy.getByCy('theme-selector').click();
      cy.getByCy('pink-bluegrey-button').click();
      cy.getByCy('navbar-header').should(
        'have.css',
        'background-color',
        'rgb(233, 30, 99)'
      );
      cy.getByCy('theme-selector').click();
      cy.getByCy('purple-green-button').click();
      cy.getByCy('navbar-header').should(
        'have.css',
        'background-color',
        'rgb(156, 39, 176)'
      );
      cy.getByCy('theme-selector').click();
      cy.getByCy('red-teal-button').click();
      cy.getByCy('navbar-header').should(
        'have.css',
        'background-color',
        'rgb(255, 0, 0)'
      );
      cy.getByCy('theme-selector').click();
      cy.getByCy('custom-dark-button').click();
      cy.wait(500); // Waiting for dynamic theme to be applied
      cy.getByCy('navbar-header').should(
        'have.css',
        'background-color',
        'rgb(125, 207, 42)'
      );
    });

    it('should be able to create a custom light and dark theme', () => {
      cy.visit('/theme/create');
      cy.getByCy('primary-palette').within(() => {
        cy.changeColor('main-color-input', '#00ffaa');
      });
      cy.getByCy('accent-palette').within(() => {
        cy.changeColor('main-color-input', '#ff77aa');
      });
      cy.getByCy('warn-palette').within(() => {
        cy.changeColor('main-color-input', '#fff000');
      });
      cy.getByCy('success-palette').within(() => {
        cy.changeColor('main-color-input', '#00aa00');
      });
      cy.getByCy('error-palette').within(() => {
        cy.changeColor('main-color-input', '#ff0000');
      });
      cy.getByCy('info-palette').within(() => {
        cy.changeColor('main-color-input', '#00f0ff');
      });
      cy.wait(500); // Wait for algorithm to finish as it's on debounce
      cy.getByCy('save-light-theme-button').click();
      cy.getByCy('snackbar-container')
        .should('be.visible')
        .within(() => {
          cy.getByCy('message').should(
            'contain.text',
            'Saved light theme successfully'
          );
          cy.getByCy('close-button').click();
        });
      cy.getByCy('primary-palette').within(() => {
        cy.changeColor('main-color-input', '#ee66ee');
      });
      cy.getByCy('accent-palette').within(() => {
        cy.changeColor('main-color-input', '#aaffff');
      });
      cy.getByCy('warn-palette').within(() => {
        cy.changeColor('main-color-input', '#ff5500');
      });
      cy.getByCy('success-palette').within(() => {
        cy.changeColor('main-color-input', '#00ff00');
      });
      cy.getByCy('error-palette').within(() => {
        cy.changeColor('main-color-input', '#fe0fe0');
      });
      cy.getByCy('info-palette').within(() => {
        cy.changeColor('main-color-input', '#1010ff');
      });
      cy.wait(500); // Wait for algorithm to finish as it's on debounce
      cy.getByCy('save-dark-theme-button').click();
      cy.getByCy('snackbar-container')
        .should('be.visible')
        .within(() => {
          cy.getByCy('message').should(
            'contain.text',
            'Saved dark theme successfully'
          );
          cy.getByCy('close-button').click();
        });
    });
  });

  it('should load correct custom dark and light themes', () => {
    cy.login('admin').then(() => {
      cy.visit('/');
    });
    cy.visit('/theme/view');
    cy.getByCy('theme-selector').click();
    cy.getByCy('custom-light-button').click();
    cy.wait(500); // Waiting for dynamic theme to be applied
    cy.getByCy('primary-palette').within(() => {
      cy.getByCy('default').should(
        'have.css',
        'background-color',
        'rgb(0, 255, 170)'
      );
    });
    cy.getByCy('accent-palette').within(() => {
      cy.getByCy('default').should(
        'have.css',
        'background-color',
        'rgb(255, 119, 170)'
      );
    });
    cy.getByCy('warn-palette').within(() => {
      cy.getByCy('default').should(
        'have.css',
        'background-color',
        'rgb(255, 240, 0)'
      );
    });
    cy.getByCy('success-palette').within(() => {
      cy.getByCy('default').should(
        'have.css',
        'background-color',
        'rgb(0, 170, 0)'
      );
    });
    cy.getByCy('error-palette').within(() => {
      cy.getByCy('default').should(
        'have.css',
        'background-color',
        'rgb(255, 0, 0)'
      );
    });
    cy.getByCy('info-palette').within(() => {
      cy.getByCy('default').should(
        'have.css',
        'background-color',
        'rgb(0, 240, 255)'
      );
    });
    cy.getByCy('theme-selector').click();
    cy.getByCy('custom-dark-button').within(() => {
      cy.getByCy('custom-dark-display-name').click();
    });
    cy.wait(500); // Waiting for dynamic theme to be applied
    cy.getByCy('primary-palette')
      .should('be.visible')
      .within(() => {
        cy.getByCy('default').should(
          'have.css',
          'background-color',
          'rgb(238, 102, 238)'
        );
      });
    cy.getByCy('accent-palette').within(() => {
      cy.getByCy('default').should(
        'have.css',
        'background-color',
        'rgb(170, 255, 255)'
      );
    });
    cy.getByCy('warn-palette').within(() => {
      cy.getByCy('default').should(
        'have.css',
        'background-color',
        'rgb(255, 85, 0)'
      );
    });
    cy.getByCy('success-palette').within(() => {
      cy.getByCy('default').should(
        'have.css',
        'background-color',
        'rgb(0, 255, 0)'
      );
    });
    cy.getByCy('error-palette').within(() => {
      cy.getByCy('default').should(
        'have.css',
        'background-color',
        'rgb(254, 15, 224)'
      );
    });
    cy.getByCy('info-palette').within(() => {
      cy.getByCy('default').should(
        'have.css',
        'background-color',
        'rgb(16, 16, 255)'
      );
    });
  });
});
