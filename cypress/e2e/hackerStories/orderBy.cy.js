import data from '../../resources/data.config';

describe('Order by', {
  env: { snapshotOnly: true },
  tags: {
    squad: 'qa-frontend',
    executionType: 'regression',
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
