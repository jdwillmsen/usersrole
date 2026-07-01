import { AboutComponent } from './about.component';
import { ActivatedRoute } from '@angular/router';

describe('AboutComponent', () => {
  beforeEach(() => {
    cy.mount(AboutComponent, {
      providers: [{ provide: ActivatedRoute, useValue: {} }]
    });
  });

  it('should mount', () => {
    cy.getByCy('about-page').should('be.visible');
  });

  it('renders all four info cards', () => {
    cy.getByCy('build-card').should('be.visible');
    // Assert the live Angular runtime line, not a generated dep: during CT the
    // component reads the committed placeholder version-info.ts (deps {}), since
    // `prebuild` only runs for `npm run build`, not for cypress.
    cy.getByCy('libraries-card')
      .should('be.visible')
      .and('contain.text', 'Angular (runtime)');
    cy.getByCy('runtime-card').should('be.visible');
    cy.getByCy('project-card')
      .should('be.visible')
      .and('contain.text', 'jdwillmsen/usersrole');
  });

  it('hides the commit link for the placeholder dev build', () => {
    // Tracked version-info.ts ships commit 'dev', so no GitHub commit link renders.
    cy.getByCy('commit-link').should('not.exist');
  });
});
