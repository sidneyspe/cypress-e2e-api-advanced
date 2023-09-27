import data from '../../../resources/data.config';

const options = { env: { snapshotOnly: true } };

describe('Search', options, () => {
  beforeEach(() => {
    cy.visit('/');

    cy.intercept({
      method: 'GET',
      pathname: '**/search',
      query: {
        query: data.newTerm,
        page: '0',
      },
    }).as('getNewTermStories');

    cy.get('#search').should('be.visible').clear();
  });

  it('types and hits ENTER', () => {
    cy.get('#search').should('be.visible').type(`${data.newTerm}{enter}`);

    cy.wait('@getNewTermStories');

    cy.get('.item').should('have.length', 20);
    cy.get('.item').first().should('contain', data.newTerm);
    cy.get(`button:contains(${data.initialTerm})`).should('be.visible');
  });

  it('types and clicks the submit button', () => {
    cy.get('#search').should('be.visible').type(data.newTerm);
    cy.contains('Submit').should('be.visible').click();

    cy.wait('@getNewTermStories');

    cy.get('.item').should('have.length', 20);
    cy.get('.item').first().should('contain', data.newTerm);
    cy.get(`button:contains(${data.initialTerm})`).should('be.visible');
  });

  it('types and submits the form directly', () => {
    cy.get('#search').should('be.visible').type(data.newTerm);
    cy.get('form').submit();

    cy.wait('@getNewTermStories');

    cy.get('.item').should('have.length', 20);
  });
});
