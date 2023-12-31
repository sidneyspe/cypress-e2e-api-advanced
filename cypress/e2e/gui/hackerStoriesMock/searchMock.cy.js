import data from '../../../resources/data.config';

const options = { env: { snapshotOnly: true } };

describe('Search', options, () => {
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
      { fixture: 'empty' }
    ).as('getEmptyStories');

    cy.intercept(
      {
        method: 'GET',
        pathname: '**/search',
        query: {
          query: data.newTerm,
          page: '0',
        },
      },
      { fixture: 'stories' }
    ).as('getStories');

    cy.visit('/');
    cy.wait('@getEmptyStories');

    cy.get('#search').should('be.visible').clear();
  });

  it('types and hits ENTER', () => {
    cy.get('#search').should('be.visible').type(`${data.newTerm}{enter}`);

    cy.wait('@getStories');

    cy.getLocalStorage('search').should('be.equal', data.newTerm);

    cy.get('.item').should('have.length', 2);
    cy.get(`button:contains(${data.initialTerm})`).should('be.visible');
  });

  it('types and clicks the submit button', () => {
    cy.get('#search').should('be.visible').type(data.newTerm);
    cy.contains('Submit').should('be.visible').click();

    cy.wait('@getStories');

    cy.getLocalStorage('search').should('be.equal', data.newTerm);

    cy.get('.item').should('have.length', 2);
    cy.get(`button:contains(${data.initialTerm})`).should('be.visible');
  });

  it('shows no story when none is returned', () => {
    cy.get('.item').should('not.exist');
  });
});
