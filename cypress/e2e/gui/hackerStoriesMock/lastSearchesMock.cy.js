import { faker } from '@faker-js/faker';
import data from '../../../resources/data.config';

const options = { env: { snapshotOnly: true } };

describe('Last searches', options, () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        pathname: '**/search**',
      },
      { fixture: 'empty' }
    ).as('getEmptyStories');

    cy.visit('/');

    cy.get('#search').should('be.visible').clear();
  });

  it('shows a max of 5 buttons for the last searched terms', () => {
    cy.intercept(
      {
        method: 'GET',
        pathname: '**/search**',
      },
      { fixture: 'empty' }
    ).as('getRandomStories');

    Cypress._.times(6, () => {
      cy.get('#search').should('be.visible').clear();
      cy.get('#search')
        .should('be.visible')
        .type(`${faker.random.word()}{enter}`);
      cy.wait('@getRandomStories');
    });

    cy.get('.last-searches button').should('have.length', 5);
  });
});
