import { faker } from '@faker-js/faker';
import { SELECTORS } from '../../support/selectors';

describe('Last Searches (Mock)', {
  env: { snapshotOnly: true },
  tags: {
    squad: 'qa-api',
    executionType: 'regression',
    product: 'hacker-stories',
    module: 'search',
    functionality: 'integration',
  },
}, () => {
  beforeEach(() => {
    cy.interceptStories({
      alias: 'getEmptyStories',
      fixture: 'empty',
    });

    cy.visit('/');
    cy.wait('@getEmptyStories');

    cy.get(SELECTORS.search.input).should('be.visible').clear();
  });

  it('shows a max of 5 buttons for the last searched terms', () => {
    cy.interceptStories({
      alias: 'getRandomStories',
      fixture: 'empty',
    });

    const searchCount = 6;

    Cypress._.times(searchCount, () => {
      const randomWord = faker.word.sample();
      cy.searchByEnter(randomWord);
      cy.wait('@getRandomStories');
      cy.getLocalStorage('search').should('be.equal', randomWord);
    });

    cy.get(SELECTORS.search.lastSearches).within(() => {
      cy.get('button').should('have.length', 5);
    });
  });
});
