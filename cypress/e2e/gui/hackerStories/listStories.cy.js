import data from '../../../resources/data.config';

const options = { env: { snapshotOnly: true } };

describe('List of stories', options, () => {
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

  it('shows 20 stories, then the next 20 after clicking "More"', () => {
    cy.intercept({
      method: 'GET',
      pathname: '**/search',
      query: {
        query: data.initialTerm,
        page: '1',
      },
    }).as('getNextStories');

    cy.get('.item').should('have.length', 20);
    cy.contains('More').should('be.visible').click();

    cy.wait('@getNextStories');

    cy.get('.item').should('have.length', 40);
  });

  it('shows only nineteen stories after dimissing the first story', () => {
    cy.get('.button-small').first().should('be.visible').click();

    cy.get('.item').should('have.length', 19);
  });
});
