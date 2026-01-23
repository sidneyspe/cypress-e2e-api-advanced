import { SELECTORS } from '../../support/selectors';

describe(
  'List of Stories',
  {
    env: { snapshotOnly: true },
    tags: ['@smoke', '@qa-frontend', '@stories', '@e2e', '@high'],
  },
  () => {
    beforeEach(() => {
      cy.interceptStories({ alias: 'getStories' });
      cy.visit('/');
      cy.wait('@getStories');
    });

    context('Pagination', () => {
      it(
        'shows 20 stories, then the next 20 after clicking "More"',
        { tags: ['@smoke', '@pagination'] },
        () => {
          cy.interceptStories({ alias: 'getNextStories' });

          // Explicit assertions - NOT abstracted in functions
          cy.get(SELECTORS.stories.item).should('have.length', 20);
          cy.get(SELECTORS.stories.moreButton).should('be.visible').click();

          cy.wait('@getNextStories');

          // Explicit assertions - NOT abstracted in functions
          cy.get(SELECTORS.stories.item).should('have.length', 40);
        }
      );
    });

    context('Dismiss Story', () => {
      it(
        'shows only 19 stories after dismissing the first story',
        { tags: ['@regression', '@dismiss'] },
        () => {
          // Explicit assertion before action
          cy.get(SELECTORS.stories.item).should('have.length', 20);

          cy.dismissStory(0);

          // Explicit assertion after action
          cy.get(SELECTORS.stories.item).should('have.length', 19);
        }
      );
    });
  }
);
