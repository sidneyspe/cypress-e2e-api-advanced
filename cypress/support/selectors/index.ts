/**
 * Centralized selectors for Hacker Stories application
 * Organized by component/feature for easy maintenance
 */

import { SEARCH_SELECTORS } from './search.selectors';
import {
  STORIES_SELECTORS,
  LIST_HEADER_SELECTORS,
  MESSAGES_SELECTORS,
} from './stories.selectors';

export const SELECTORS = {
  search: SEARCH_SELECTORS,
  stories: STORIES_SELECTORS,
  listHeader: LIST_HEADER_SELECTORS,
  messages: MESSAGES_SELECTORS,
};

export { SEARCH_SELECTORS } from './search.selectors';
export {
  STORIES_SELECTORS,
  LIST_HEADER_SELECTORS,
  MESSAGES_SELECTORS,
} from './stories.selectors';

export default SELECTORS;
