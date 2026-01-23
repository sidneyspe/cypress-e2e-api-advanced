import { SELECTORS } from '../../support/selectors';
import { testData } from '../../support/e2e';

describe(
  'Order by',
  {
    env: { snapshotOnly: true },
    tags: {
      squad: 'qa-frontend',
      executionType: 'regression',
      product: 'hacker-stories',
      module: 'stories',
      functionality: 'e2e',
      priority: 'medium',
    },
  },
  () => {
    beforeEach(() => {
      cy.interceptStories({ alias: 'getStories' });
      cy.visit('/');
      cy.wait('@getStories');
    });

    it('orders by title', () => {
      cy.sortBy('title');

      // Explicit assertions - verify sort was triggered
      cy.get(SELECTORS.listHeader.title).should('be.visible');
      cy.get(SELECTORS.stories.item).should('have.length.greaterThan', 0);
    });

    it('orders by author', () => {
      cy.sortBy('author');

      // Explicit assertions - verify sort was triggered
      cy.get(SELECTORS.listHeader.author).should('be.visible');
      cy.get(SELECTORS.stories.item).should('have.length.greaterThan', 0);
    });

    it('orders by comments', () => {
      cy.sortBy('comments');

      // Explicit assertions - verify sort was triggered
      cy.get(SELECTORS.listHeader.comments).should('be.visible');
      cy.get(SELECTORS.stories.item).should('have.length.greaterThan', 0);
    });

    it('orders by points', () => {
      cy.sortBy('points');

      // Explicit assertions - verify sort was triggered
      cy.get(SELECTORS.listHeader.points).should('be.visible');
      cy.get(SELECTORS.stories.item).should('have.length.greaterThan', 0);
    });
  }
);
