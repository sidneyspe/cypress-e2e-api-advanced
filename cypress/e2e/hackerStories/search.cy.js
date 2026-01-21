import data from '../../resources/data.config';
import { SELECTORS } from '../../support/selectors';

describe('Search', {
  env: { snapshotOnly: true },
  tags: {
    squad: 'qa-core',
    executionType: 'smoke',
    product: 'hacker-stories',
    module: 'search',
    functionality: 'e2e',
  },
}, () => {
  beforeEach(() => {
    cy.visit('/');

    cy.interceptStories({
      term: data.newTerm,
      alias: 'getNewTermStories',
    });

    cy.get(SELECTORS.search.input).should('be.visible').clear();
  });

  context('Search Methods', () => {
    it('types and hits ENTER', () => {
      cy.searchByEnter(data.newTerm);
      cy.wait('@getNewTermStories');

      cy.verifySearchResults({
        term: data.newTerm,
        itemCount: 20,
        containsTerm: data.newTerm,
        previousSearchVisible: data.initialTerm,
      });
    });

    it('types and clicks the submit button', () => {
      cy.searchBySubmitButton(data.newTerm);
      cy.wait('@getNewTermStories');

      cy.verifySearchResults({
        term: data.newTerm,
        itemCount: 20,
        containsTerm: data.newTerm,
        previousSearchVisible: data.initialTerm,
      });
    });

    it('types and submits the form directly', () => {
      cy.searchByFormSubmit(data.newTerm);
      cy.wait('@getNewTermStories');

      cy.verifySearchResults({
        term: data.newTerm,
        itemCount: 20,
      });
    });
  });
});
