// API support file
// Import shared commands and configurations

import './mochawesome-context';
import './types/index.d';

// Data config
export const testData = {
  initialTerm: 'React',
  newTerm: 'Cypress',
};

// API-specific configurations
export const apiConfig = {
  baseUrl: Cypress.env('apiUrl') || 'https://hn.algolia.com/api/v1',
  endpoints: {
    search: '/search',
    searchByDate: '/search_by_date',
  },
};
