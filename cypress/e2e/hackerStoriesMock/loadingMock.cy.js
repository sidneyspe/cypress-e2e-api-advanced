import { SELECTORS } from '../../support/selectors';

describe('Loading State (Mock)', {
  env: { snapshotOnly: true },
  tags: {
    squad: 'qa-frontend',
    executionType: 'smoke',
    product: 'hacker-stories',
    module: 'user-experience',
    functionality: 'integration',
  },
}, () => {
  beforeEach(() => {
    cy.interceptStories({
      alias: 'getDelayedStories',
      fixture: 'stories',
      delay: 1000,
    });
  });

  it('shows a "Loading ..." state before showing the results', () => {
    cy.visit('/');

    cy.assertLoadingIsShownAndHidden();
    cy.wait('@getDelayedStories');

    cy.get(SELECTORS.stories.item).should('have.length', 2);
  });
});
