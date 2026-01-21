import { faker } from '@faker-js/faker';

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
      const randomWord = faker.random.word();
      cy.get('#search').should('be.visible').clear();
      cy.get('#search').should('be.visible').type(`${randomWord}{enter}`);
      cy.wait('@getRandomStories');
      cy.getLocalStorage('search').should('be.equal', randomWord);
    });

    cy.get('.last-searches').within(() => {
      cy.get('button').should('have.length', 5);
    });
  });
});
