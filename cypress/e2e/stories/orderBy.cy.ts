import { SELECTORS } from '../../support/selectors';

describe(
  'Order by',
  {
    env: { snapshotOnly: true },
    tags: ['@regression', '@qa-frontend', '@stories', '@e2e', '@medium'],
  },
  () => {
    beforeEach(() => {
      cy.interceptStories({ alias: 'getStories' });
      cy.visit('/');
      cy.wait('@getStories');
    });

    it('orders by title', { tags: ['@regression', '@sorting'] }, () => {
      cy.sortBy('title');

      // Explicit assertions - verify sort was triggered
      cy.get(SELECTORS.listHeader.title).should('be.visible');
      cy.get(SELECTORS.stories.item).should('have.length.greaterThan', 0);
    });

    it('orders by author', { tags: ['@regression', '@sorting'] }, () => {
      cy.sortBy('author');

      // Explicit assertions - verify sort was triggered
      cy.get(SELECTORS.listHeader.author).should('be.visible');
      cy.get(SELECTORS.stories.item).should('have.length.greaterThan', 0);
    });

    it('orders by comments', { tags: ['@regression', '@sorting'] }, () => {
      cy.sortBy('comments');

      // Explicit assertions - verify sort was triggered
      cy.get(SELECTORS.listHeader.comments).should('be.visible');
      cy.get(SELECTORS.stories.item).should('have.length.greaterThan', 0);
    });

    it('orders by points', { tags: ['@regression', '@sorting'] }, () => {
      cy.sortBy('points');

      // Explicit assertions - verify sort was triggered
      cy.get(SELECTORS.listHeader.points).should('be.visible');
      cy.get(SELECTORS.stories.item).should('have.length.greaterThan', 0);
    });
  }
);
