import { SELECTORS } from '../../support/selectors';
import { testData } from '../../support/e2e';

describe(
  'Search',
  {
    env: { snapshotOnly: true },
    tags: ['@smoke', '@qa-core', '@search', '@e2e', '@critical'],
  },
  () => {
    beforeEach(() => {
      cy.visit('/');

      cy.interceptStories({ alias: 'getNewTermStories' });

      cy.get(SELECTORS.search.input).should('be.visible').clear();
    });

    context('Search Methods', () => {
      it('types and hits ENTER', { tags: ['@smoke'] }, () => {
        cy.searchByEnter(testData.newTerm);
        cy.wait('@getNewTermStories');

        // Explicit assertions - NOT abstracted in functions
        cy.getLocalStorage('search').should('be.equal', testData.newTerm);
        cy.get(SELECTORS.stories.item).should('have.length', 20);
        cy.get(SELECTORS.stories.item).first().should('contain', testData.newTerm);
        cy.get(SELECTORS.search.lastSearchButton(testData.initialTerm)).should('be.visible');
      });

      it('types and clicks the submit button', { tags: ['@smoke'] }, () => {
        cy.searchBySubmitButton(testData.newTerm);
        cy.wait('@getNewTermStories');

        // Explicit assertions - NOT abstracted in functions
        cy.getLocalStorage('search').should('be.equal', testData.newTerm);
        cy.get(SELECTORS.stories.item).should('have.length', 20);
        cy.get(SELECTORS.stories.item).first().should('contain', testData.newTerm);
        cy.get(SELECTORS.search.lastSearchButton(testData.initialTerm)).should('be.visible');
      });

      it('types and submits the form directly', { tags: ['@regression'] }, () => {
        cy.searchByFormSubmit(testData.newTerm);
        cy.wait('@getNewTermStories');

        // Explicit assertions - NOT abstracted in functions
        cy.getLocalStorage('search').should('be.equal', testData.newTerm);
        cy.get(SELECTORS.stories.item).should('have.length', 20);
      });
    });
  }
);
