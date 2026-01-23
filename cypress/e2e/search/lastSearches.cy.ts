import { faker } from '@faker-js/faker';
import { SELECTORS } from '../../support/selectors';
import { testData } from '../../support/e2e';

describe(
  'Last Searches',
  {
    env: { snapshotOnly: true },
    tags: ['@regression', '@qa-frontend', '@search', '@e2e', '@medium'],
  },
  () => {
    beforeEach(() => {
      cy.interceptStories({ alias: 'getStories' });
      cy.visit('/');
      cy.wait('@getStories');

      cy.interceptStories({ alias: 'getNewTermStories' });

      cy.get(SELECTORS.search.input).should('be.visible').clear();
    });

    it('searches via the last searched term', { tags: ['@regression'] }, () => {
      cy.searchByEnter(testData.newTerm);
      cy.wait('@getNewTermStories');

      // Explicit assertions - NOT abstracted in functions
      cy.getLocalStorage('search').should('be.equal', testData.newTerm);

      cy.get(SELECTORS.search.lastSearchButton(testData.initialTerm)).should('be.visible').click();

      cy.wait('@getStories');

      // Explicit assertions - NOT abstracted in functions
      cy.getLocalStorage('search').should('be.equal', testData.initialTerm);
      cy.get(SELECTORS.stories.item).should('have.length', 20);
      cy.get(SELECTORS.stories.item).first().should('contain', testData.initialTerm);
      cy.get(SELECTORS.search.lastSearchButton(testData.newTerm)).should('be.visible');
    });

    it('shows a max of 5 buttons for the last searched terms', { tags: ['@regression'] }, () => {
      cy.interceptStories({ alias: 'getRandomStories' });

      const searchCount = 6;

      Cypress._.times(searchCount, () => {
        const randomWord = faker.word.sample();
        cy.searchByEnter(randomWord);
        cy.wait('@getRandomStories');

        // Explicit assertion
        cy.getLocalStorage('search').should('be.equal', randomWord);
      });

      // Explicit assertions - NOT abstracted in functions
      cy.get(SELECTORS.search.lastSearches).within(() => {
        cy.get('button').should('have.length', 5);
      });
    });
  }
);
