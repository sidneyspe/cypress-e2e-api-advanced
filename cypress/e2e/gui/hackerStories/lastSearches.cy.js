import { faker } from '@faker-js/faker';

const options = { env: { snapshotOnly: true } };

const initialTerm = 'React';
const newTerm = 'Cypress';

describe('Last searches', options, () => {
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

  it('searches via the last searched term', () => {
    cy.get('#search').type(`${newTerm}{enter}`);

    cy.wait('@getNewTermStories');

    cy.get(`button:contains(${initialTerm})`).should('be.visible').click();

    cy.wait('@getStories');

    cy.get('.item').should('have.length', 20);
    cy.get('.item').first().should('contain', initialTerm);
    cy.get(`button:contains(${newTerm})`).should('be.visible');
  });

  it('shows a max of 5 buttons for the last searched terms', () => {
    cy.intercept({
      method: 'GET',
      pathname: '**/search**',
    }).as('getRandomStories');

    Cypress._.times(6, () => {
      cy.get('#search').clear();
      cy.get('#search').type(`${faker.random.word()}{enter}`);
      cy.wait('@getRandomStories');
    });

    cy.get('.last-searches button').should('have.length', 5);
  });
});
