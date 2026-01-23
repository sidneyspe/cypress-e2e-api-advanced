/**
 * Search component selectors
 * Centralized selectors for search functionality
 */

export const SEARCH_SELECTORS = {
  input: '#search',
  submitButton: 'button:contains("Submit")',
  form: 'form',
  lastSearches: '.last-searches',
  lastSearchButton: (term: string) => `button:contains("${term}")`,
};

export default SEARCH_SELECTORS;
