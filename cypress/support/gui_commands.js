import 'cypress-localstorage-commands';
import { SELECTORS } from './selectors';

/**
 * Custom command to assert loading state appears and then disappears
 */
Cypress.Commands.add('assertLoadingIsShownAndHidden', () => {
  cy.contains('Loading ...').should('be.visible');
  cy.contains('Loading ...').should('not.exist');
});

/**
 * Custom command to search for a term using ENTER key
 * @param {string} term - The search term to type
 */
Cypress.Commands.add('searchByEnter', (term) => {
  cy.get(SELECTORS.search.input)
    .should('be.visible')
    .clear()
    .type(`${term}{enter}`);
});

/**
 * Custom command to search for a term using Submit button
 * @param {string} term - The search term to type
 */
Cypress.Commands.add('searchBySubmitButton', (term) => {
  cy.get(SELECTORS.search.input).should('be.visible').clear().type(term);
  cy.contains('Submit').should('be.visible').click();
});

/**
 * Custom command to search for a term using form submission
 * @param {string} term - The search term to type
 */
Cypress.Commands.add('searchByFormSubmit', (term) => {
  cy.get(SELECTORS.search.input).should('be.visible').clear().type(term);
  cy.get(SELECTORS.search.form).submit();
});

/**
 * Custom command to verify search results
 * @param {object} options - Verification options
 * @param {string} options.term - The search term to verify in localStorage
 * @param {number} options.itemCount - Expected number of story items
 * @param {string} [options.containsTerm] - Optional term that first item should contain
 * @param {string} [options.previousSearchVisible] - Optional previous search term button to verify
 */
Cypress.Commands.add('verifySearchResults', (options) => {
  const { term, itemCount, containsTerm, previousSearchVisible } = options;

  if (term) {
    cy.getLocalStorage('search').should('be.equal', term);
  }

  cy.get(SELECTORS.stories.item).should('have.length', itemCount);

  if (containsTerm) {
    cy.get(SELECTORS.stories.item).first().should('contain', containsTerm);
  }

  if (previousSearchVisible) {
    cy.get(SELECTORS.search.lastSearchButton(previousSearchVisible)).should(
      'be.visible'
    );
  }
});

/**
 * Custom command to dismiss a story by index
 * @param {number} [index=0] - The index of the story to dismiss (0-based)
 */
Cypress.Commands.add('dismissStory', (index = 0) => {
  cy.get(SELECTORS.stories.dismissButton).eq(index).should('be.visible').click();
});

/**
 * Custom command to click on a sort header
 * @param {string} column - The column to sort by ('title', 'author', 'comments', 'points')
 */
Cypress.Commands.add('sortBy', (column) => {
  const headerSelector = SELECTORS.listHeader[column];
  if (!headerSelector) {
    throw new Error(`Invalid column: ${column}. Use: title, author, comments, or points`);
  }
  cy.get(headerSelector).should('be.visible').click();
});

/**
 * Custom command to verify story content
 * @param {number} index - The story index (0 for first, -1 for last)
 * @param {object} story - The story data to verify
 */
Cypress.Commands.add('verifyStoryContent', (index, story) => {
  const getItem = index === -1
    ? cy.get(SELECTORS.stories.item).last()
    : cy.get(SELECTORS.stories.item).eq(index);

  getItem
    .should('be.visible')
    .and('contain', story.title)
    .and('contain', story.author)
    .and('contain', story.num_comments)
    .and('contain', story.points);

  cy.get(SELECTORS.stories.itemLink(story.title)).should(
    'have.attr',
    'href',
    story.url
  );
});

/**
 * Custom command to intercept stories API with optional fixture
 * @param {object} options - Intercept options
 * @param {string} options.term - The search term to match
 * @param {string} [options.page='0'] - The page number to match
 * @param {string} [options.fixture] - Optional fixture name to use
 * @param {number} [options.statusCode] - Optional status code for error simulation
 * @param {boolean} [options.forceNetworkError] - Force network error
 * @param {number} [options.delay] - Optional delay in milliseconds
 * @param {string} options.alias - The alias name for the intercept
 */
Cypress.Commands.add('interceptStories', (options) => {
  const { term, page = '0', fixture, statusCode, forceNetworkError, delay, alias } = options;

  const routeMatcher = {
    method: 'GET',
    pathname: '**/search',
  };

  if (term) {
    routeMatcher.query = { query: term, page };
  } else {
    routeMatcher.pathname = '**/search**';
  }

  const routeHandler = {};

  if (fixture) {
    routeHandler.fixture = fixture;
  }
  if (statusCode) {
    routeHandler.statusCode = statusCode;
  }
  if (forceNetworkError) {
    routeHandler.forceNetworkError = true;
  }
  if (delay) {
    routeHandler.delay = delay;
  }

  if (Object.keys(routeHandler).length > 0) {
    cy.intercept(routeMatcher, routeHandler).as(alias);
  } else {
    cy.intercept(routeMatcher).as(alias);
  }
});
