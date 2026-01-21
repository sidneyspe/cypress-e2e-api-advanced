import data from '../../resources/data.config';
import { SELECTORS } from '../../support/selectors';

describe('Errors', {
  env: { snapshotOnly: true },
  tags: {
    squad: 'qa-core',
    executionType: 'regression',
    product: 'hacker-stories',
    module: 'error-handling',
    functionality: 'e2e',
  },
}, () => {
  beforeEach(() => {
    cy.interceptStories({
      term: data.initialTerm,
      alias: 'getStories',
    });

    cy.visit('/');
    cy.wait('@getStories');
  });

  context('Server Errors', () => {
    it('shows error message on server error (500)', () => {
      cy.interceptStories({
        alias: 'getServerFailure',
        statusCode: 500,
      });

      cy.visit('/');
      cy.wait('@getServerFailure');

      cy.get(SELECTORS.messages.error).should('be.visible');
    });
  });

  context('Network Errors', () => {
    it('shows error message on network failure', () => {
      cy.interceptStories({
        alias: 'getNetworkFailure',
        forceNetworkError: true,
      });

      cy.visit('/');
      cy.wait('@getNetworkFailure');

      cy.get(SELECTORS.messages.error).should('be.visible');
    });
  });
});
