import data from '../../resources/data.config';
import { SELECTORS } from '../../support/selectors';

describe('List of Stories', {
  env: { snapshotOnly: true },
  tags: {
    squad: 'qa-frontend',
    executionType: 'smoke',
    product: 'hacker-stories',
    module: 'stories',
    functionality: 'e2e',
  },
}, () => {
  beforeEach(() => {
    cy.interceptStories({
      term: data.initialTerm,
      alias: 'getStories',
    });

    cy.visit('/');
    cy.wait('@getStories');
  });

  context('Pagination', () => {
    it('shows 20 stories, then the next 20 after clicking "More"', () => {
      cy.interceptStories({
        term: data.initialTerm,
        page: '1',
        alias: 'getNextStories',
      });

      cy.get(SELECTORS.stories.item).should('have.length', 20);
      cy.get(SELECTORS.stories.moreButton).should('be.visible').click();

      cy.wait('@getNextStories');

      cy.get(SELECTORS.stories.item).should('have.length', 40);
    });
  });

  context('Dismiss Story', () => {
    it('shows only 19 stories after dismissing the first story', () => {
      cy.dismissStory(0);
      cy.get(SELECTORS.stories.item).should('have.length', 19);
    });
  });
});
