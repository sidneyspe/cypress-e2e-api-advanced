const options = { env: { snapshotOnly: true } };

const initialTerm = 'React';
const newTerm = 'Cypress';

describe('Search', options, () => {
  beforeEach(() => {
    cy.visit('/');

    cy.intercept({
      method: 'GET',
      pathname: '**/search',
      query: {
        query: newTerm,
        page: '0',
      },
    }).as('getNewTermStories');

    cy.get('#search').clear();
  });

  it('types and hits ENTER', () => {
    cy.get('#search').type(`${newTerm}{enter}`);

    cy.wait('@getNewTermStories');

    cy.get('.item').should('have.length', 20);
    cy.get('.item').first().should('contain', newTerm);
    cy.get(`button:contains(${initialTerm})`).should('be.visible');
  });

  it('types and clicks the submit button', () => {
    cy.get('#search').type(newTerm);
    cy.contains('Submit').click();

    cy.wait('@getNewTermStories');

    cy.get('.item').should('have.length', 20);
    cy.get('.item').first().should('contain', newTerm);
    cy.get(`button:contains(${initialTerm})`).should('be.visible');
  });

  it('types and submits the form directly', () => {
    cy.get('#search').type(newTerm);
    cy.get('form').submit();

    cy.wait('@getNewTermStories');

    cy.get('.item').should('have.length', 20);
  });
});
