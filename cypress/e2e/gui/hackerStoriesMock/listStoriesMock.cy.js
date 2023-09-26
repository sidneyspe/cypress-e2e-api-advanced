import data from '../../../resources/data.config';

const options = { env: { snapshotOnly: true } };

describe('List of stories', options, () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        pathname: '**/search',
        query: {
          query: data.initialTerm,
          page: '0',
        },
      },
      { fixture: 'stories' }
    ).as('getStories');

    cy.visit('/');

    cy.wait('@getStories');
  });

  it('shows only less story after dimissing the first one', () => {
    cy.get('.button-small').first().click();

    cy.get('.item').should('have.length', 1);
  });
});
