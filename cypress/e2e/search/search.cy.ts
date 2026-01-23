import { SELECTORS } from '../../support/selectors';
import { testData } from '../../support/e2e';

describe(
  'Search',
  {
    env: { snapshotOnly: true },
    tags: {
      squad: 'qa-core',
      executionType: 'smoke',
      product: 'hacker-stories',
      module: 'search',
      functionality: 'e2e',
      priority: 'critical',
    },
  },
  () => {
    beforeEach(() => {
      cy.visit('/');

      cy.interceptStories({ alias: 'getNewTermStories' });

      cy.get(SELECTORS.search.input).should('be.visible').clear();
    });

    context('Search Methods', () => {
      it('types and hits ENTER', () => {
        cy.searchByEnter(testData.newTerm);
        cy.wait('@getNewTermStories');

        // Explicit assertions - NOT abstracted in functions
        cy.getLocalStorage('search').should('be.equal', testData.newTerm);
        cy.get(SELECTORS.stories.item).should('have.length', 20);
        cy.get(SELECTORS.stories.item).first().should('contain', testData.newTerm);
        cy.get(SELECTORS.search.lastSearchButton(testData.initialTerm)).should('be.visible');
      });

      it('types and clicks the submit button', () => {
        cy.searchBySubmitButton(testData.newTerm);
        cy.wait('@getNewTermStories');

        // Explicit assertions - NOT abstracted in functions
        cy.getLocalStorage('search').should('be.equal', testData.newTerm);
        cy.get(SELECTORS.stories.item).should('have.length', 20);
        cy.get(SELECTORS.stories.item).first().should('contain', testData.newTerm);
        cy.get(SELECTORS.search.lastSearchButton(testData.initialTerm)).should('be.visible');
      });

      it('types and submits the form directly', () => {
        cy.searchByFormSubmit(testData.newTerm);
        cy.wait('@getNewTermStories');

        // Explicit assertions - NOT abstracted in functions
        cy.getLocalStorage('search').should('be.equal', testData.newTerm);
        cy.get(SELECTORS.stories.item).should('have.length', 20);
      });
    });
  }
);
