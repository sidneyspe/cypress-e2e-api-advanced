const options = { env: { snapshotOnly: true } };

describe('Order by', options, () => {
  beforeEach(() => {
    cy.intercept({
      method: 'GET',
      pathname: '**/search',
      query: {
        query: 'React',
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
