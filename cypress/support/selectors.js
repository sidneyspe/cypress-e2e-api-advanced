/**
 * Centralized selectors for Hacker Stories application
 * Organized by component/feature for easy maintenance
 */

export const SELECTORS = {
  // Search components
  search: {
    input: '#search',
    submitButton: 'button:contains("Submit")',
    form: 'form',
    lastSearches: '.last-searches',
    lastSearchButton: (term) => `button:contains("${term}")`,
  },

  // Story list components
  stories: {
    item: '.item',
    dismissButton: '.button-small',
    moreButton: 'button:contains("More")',
    itemLink: (title) => `.item a:contains("${title}")`,
  },

  // List header (sorting)
  listHeader: {
    title: '.list-header-button:contains("Title")',
    author: '.list-header-button:contains("Author")',
    comments: '.list-header-button:contains("Comments")',
    points: '.list-header-button:contains("Points")',
  },

  // Status messages
  messages: {
    loading: 'p:contains("Loading ...")',
    error: 'p:contains("Something went wrong ...")',
  },
};

export default SELECTORS;
