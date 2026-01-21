import { faker } from '@faker-js/faker';
import data from '../../../resources/data.config';

const options = { env: { snapshotOnly: true } };

describe('Last searches', options, () => {
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

  it('searches via the last searched term', () => {
    cy.get('#search').should('be.visible').type(`${data.newTerm}{enter}`);

    cy.wait('@getNewTermStories');

    cy.getLocalStorage('search').should('be.equal', data.newTerm);

    cy.get(`button:contains(${data.initialTerm})`).should('be.visible').click();

    cy.wait('@getStories');

    cy.getLocalStorage('search').should('be.equal', data.initialTerm);

    cy.get('.item').should('have.length', 20);
    cy.get('.item').first().should('contain', data.initialTerm);
    cy.get(`button:contains(${data.newTerm})`).should('be.visible');
  });

  it('shows a max of 5 buttons for the last searched terms', () => {
    cy.intercept({
      method: 'GET',
      pathname: '**/search**',
    }).as('getRandomStories');

    Cypress._.times(6, () => {
      const randomWord = faker.random.word();
      cy.get('#search').should('be.visible').clear();
      cy.get('#search').should('be.visible').type(`${randomWord}{enter}`);
      cy.wait('@getRandomStories');
      cy.getLocalStorage('search').should('be.equal', randomWord);
    });

    cy.get('.last-searches button').should('have.length', 5);
  });
});
