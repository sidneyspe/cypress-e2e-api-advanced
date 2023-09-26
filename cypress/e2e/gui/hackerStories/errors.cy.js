import data from '../../../resources/data.config';

const options = { env: { snapshotOnly: true } };

describe('Errors', options, () => {
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

  it('shows "Something went wrong ..." in case of a server error', () => {
    cy.intercept(
      {
        method: 'GET',
        pathname: '**/search**',
      },
      { statusCode: 500 }
    ).as('getServerFailure');

    cy.visit('/');
    cy.wait('@getServerFailure');

    cy.get('p:contains(Something went wrong ...)').should('be.visible');
  });

  it('shows "Something went wrong ..." in case of a network error', () => {
    cy.intercept(
      {
        method: 'GET',
        pathname: '**/search**',
      },
      { forceNetworkError: true }
    ).as('getNetworkFailure');

    cy.visit('/');
    cy.wait('@getNetworkFailure');

    cy.get('p:contains(Something went wrong ...)').should('be.visible');
  });
});
