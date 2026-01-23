import 'cypress-localstorage-commands';
import { SELECTORS } from './selectors';

/**
 * Custom command to search for a term using ENTER key
 * NOTE: This is an ACTION command, not an assertion command
 */
Cypress.Commands.add('searchByEnter', (term: string) => {
  cy.get(SELECTORS.search.input).should('be.visible').clear().type(`${term}{enter}`);
});

/**
 * Custom command to search for a term using Submit button
 * NOTE: This is an ACTION command, not an assertion command
 */
Cypress.Commands.add('searchBySubmitButton', (term: string) => {
  cy.get(SELECTORS.search.input).should('be.visible').clear().type(term);
  cy.contains('Submit').should('be.visible').click();
});

/**
 * Custom command to search for a term using form submission
 * NOTE: This is an ACTION command, not an assertion command
 */
Cypress.Commands.add('searchByFormSubmit', (term: string) => {
  cy.get(SELECTORS.search.input).should('be.visible').clear().type(term);
  cy.get(SELECTORS.search.form).submit();
});

/**
 * Custom command to dismiss a story by index
 * NOTE: This is an ACTION command, not an assertion command
 */
Cypress.Commands.add('dismissStory', (index = 0) => {
  cy.get(SELECTORS.stories.dismissButton).eq(index).should('be.visible').click();
});

/**
 * Custom command to click on a sort header
 * NOTE: This is an ACTION command, not an assertion command
 */
Cypress.Commands.add('sortBy', (column: 'title' | 'author' | 'comments' | 'points') => {
  const headerSelector = SELECTORS.listHeader[column];
  if (!headerSelector) {
    throw new Error(`Invalid column: ${column}. Use: title, author, comments, or points`);
  }
  cy.get(headerSelector).should('be.visible').click();
});

/**
 * Custom command to intercept stories API with optional fixture
 * NOTE: This is a SETUP command, not an assertion command
 */
Cypress.Commands.add(
  'interceptStories',
  (options?: {
    fixture?: string;
    alias?: string;
    statusCode?: number;
    delay?: number;
    forceNetworkError?: boolean;
  }) => {
    const { fixture, statusCode, forceNetworkError, delay, alias = 'getStories' } = options || {};

    const routeMatcher = {
      method: 'GET',
      pathname: '**/search**',
    };

    const routeHandler: {
      fixture?: string;
      statusCode?: number;
      forceNetworkError?: boolean;
      delay?: number;
    } = {};

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
  }
);
