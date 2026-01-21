import data from '../../resources/data.config';

describe('Order by', { env: { snapshotOnly: true } }, () => {
  beforeEach(() => {
    cy.interceptStories({
      term: data.initialTerm,
      alias: 'getStories',
    });

    cy.visit('/');
    cy.wait('@getStories');
  });

  it.skip('orders by title', () => {
    cy.sortBy('title');
  });

  it.skip('orders by author', () => {
    cy.sortBy('author');
  });

  it.skip('orders by comments', () => {
    cy.sortBy('comments');
  });

  it.skip('orders by points', () => {
    cy.sortBy('points');
  });
});
