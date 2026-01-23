/**
 * Stories component selectors
 * Centralized selectors for story list functionality
 */

export const STORIES_SELECTORS = {
  item: '.item',
  dismissButton: '.button-small',
  moreButton: 'button:contains("More")',
  itemLink: (title: string) => `.item a:contains("${title}")`,
};

export const LIST_HEADER_SELECTORS = {
  title: '.list-header-button:contains("Title")',
  author: '.list-header-button:contains("Author")',
  comments: '.list-header-button:contains("Comments")',
  points: '.list-header-button:contains("Points")',
};

export const MESSAGES_SELECTORS = {
  loading: 'p:contains("Loading ...")',
  error: 'p:contains("Something went wrong ...")',
};

export default {
  stories: STORIES_SELECTORS,
  listHeader: LIST_HEADER_SELECTORS,
  messages: MESSAGES_SELECTORS,
};
