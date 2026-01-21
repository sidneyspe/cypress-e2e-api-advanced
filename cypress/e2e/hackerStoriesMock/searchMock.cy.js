import data from '../../resources/data.config';
import { SELECTORS } from '../../support/selectors';

describe('Search (Mock)', {
  env: { snapshotOnly: true },
  tags: {
    squad: 'qa-api',
    executionType: 'smoke',
    product: 'hacker-stories',
    module: 'search',
    functionality: 'integration',
  },
}, () => {
  beforeEach(() => {
    cy.interceptStories({
      term: data.initialTerm,
      alias: 'getEmptyStories',
      fixture: 'empty',
    });

    cy.interceptStories({
      term: data.newTerm,
      alias: 'getStories',
      fixture: 'stories',
    });

    cy.visit('/');
    cy.wait('@getEmptyStories');

    cy.get(SELECTORS.search.input).should('be.visible').clear();
  });

  context('Search Methods', () => {
    it('types and hits ENTER', () => {
      cy.searchByEnter(data.newTerm);
      cy.wait('@getStories');

      cy.verifySearchResults({
        term: data.newTerm,
        itemCount: 2,
        previousSearchVisible: data.initialTerm,
      });
    });

    it('types and clicks the submit button', () => {
      cy.searchBySubmitButton(data.newTerm);
      cy.wait('@getStories');

      cy.verifySearchResults({
        term: data.newTerm,
        itemCount: 2,
        previousSearchVisible: data.initialTerm,
      });
    });
  });

  context('Empty Results', () => {
    it('shows no story when none is returned', () => {
      cy.get(SELECTORS.stories.item).should('not.exist');
    });
  });
});
