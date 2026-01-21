import { faker } from '@faker-js/faker';
import data from '../../resources/data.config';
import { SELECTORS } from '../../support/selectors';

describe('Last Searches', {
  env: { snapshotOnly: true },
  tags: {
    squad: 'qa-frontend',
    executionType: 'regression',
    product: 'hacker-stories',
    module: 'search',
    functionality: 'e2e',
  },
}, () => {
  beforeEach(() => {
    cy.interceptStories({
      term: data.initialTerm,
      alias: 'getStories',
    });

    cy.visit('/');

    cy.interceptStories({
      term: data.newTerm,
      alias: 'getNewTermStories',
    });

    cy.get(SELECTORS.search.input).should('be.visible').clear();
  });

  it('searches via the last searched term', () => {
    cy.searchByEnter(data.newTerm);
    cy.wait('@getNewTermStories');

    cy.getLocalStorage('search').should('be.equal', data.newTerm);

    cy.get(SELECTORS.search.lastSearchButton(data.initialTerm))
      .should('be.visible')
      .click();

    cy.wait('@getStories');

    cy.verifySearchResults({
      term: data.initialTerm,
      itemCount: 20,
      containsTerm: data.initialTerm,
      previousSearchVisible: data.newTerm,
    });
  });

  it('shows a max of 5 buttons for the last searched terms', () => {
    cy.interceptStories({
      alias: 'getRandomStories',
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
