import { SELECTORS } from '../../support/selectors';
import { testData } from '../../support/e2e';

describe(
  'List of Stories',
  {
    env: { snapshotOnly: true },
    tags: {
      squad: 'qa-frontend',
      executionType: 'smoke',
      product: 'hacker-stories',
      module: 'stories',
      functionality: 'e2e',
      priority: 'high',
    },
  },
  () => {
    beforeEach(() => {
      cy.interceptStories({ alias: 'getStories' });
      cy.visit('/');
      cy.wait('@getStories');
    });

    context('Pagination', () => {
      it('shows 20 stories, then the next 20 after clicking "More"', () => {
        cy.interceptStories({ alias: 'getNextStories' });

        // Explicit assertions - NOT abstracted in functions
        cy.get(SELECTORS.stories.item).should('have.length', 20);
        cy.get(SELECTORS.stories.moreButton).should('be.visible').click();

        cy.wait('@getNextStories');

        // Explicit assertions - NOT abstracted in functions
        cy.get(SELECTORS.stories.item).should('have.length', 40);
      });
    });

    context('Dismiss Story', () => {
      it('shows only 19 stories after dismissing the first story', () => {
        // Explicit assertion before action
        cy.get(SELECTORS.stories.item).should('have.length', 20);

        cy.dismissStory(0);

        // Explicit assertion after action
        cy.get(SELECTORS.stories.item).should('have.length', 19);
      });
    });
  }
);
