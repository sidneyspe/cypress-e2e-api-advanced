import data from '../../resources/data.config';
import stories from '../../fixtures/stories.json';
import { SELECTORS } from '../../support/selectors';

describe('List of Stories (Mock)', {
  env: { snapshotOnly: true },
  tags: {
    squad: 'qa-api',
    executionType: 'regression',
    product: 'hacker-stories',
    module: 'stories',
    functionality: 'integration',
  },
}, () => {
  beforeEach(() => {
    cy.interceptStories({
      term: data.initialTerm,
      alias: 'getStories',
      fixture: 'stories',
    });

    cy.visit('/');
    cy.wait('@getStories');
  });

  context('Story Content', () => {
    it('shows the right data for all rendered stories', () => {
      cy.verifyStoryContent(0, stories.hits[0]);
      cy.verifyStoryContent(-1, stories.hits[1]);
    });
  });

  context('Dismiss Story', () => {
    it('shows only one story after dismissing the first one', () => {
      cy.dismissStory(0);
      cy.get(SELECTORS.stories.item).should('have.length', 1);
    });
  });
});
