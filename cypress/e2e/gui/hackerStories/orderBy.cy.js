import data from '../../../resources/data.config';

const options = { env: { snapshotOnly: true } };

describe('Order by', options, () => {
  beforeEach(() => {
    cy.intercept({
      method: 'GET',
      pathname: '**/search',
      query: {
        query: data.initialTerm,
        page: '0',
      },
    }).as('getStories');

    cy.visit('/');

    cy.wait('@getStories');
  });

  it('orders by title', () => {});

  it('orders by author', () => {});

  it('orders by comments', () => {});

  it('orders by points', () => {});
});
