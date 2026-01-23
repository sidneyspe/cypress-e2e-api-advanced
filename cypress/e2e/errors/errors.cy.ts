import { SELECTORS } from '../../support/selectors';
import { testData } from '../../support/e2e';

describe(
  'Errors',
  {
    env: { snapshotOnly: true },
    tags: {
      squad: 'qa-core',
      executionType: 'regression',
      product: 'hacker-stories',
      module: 'error-handling',
      functionality: 'e2e',
      priority: 'high',
    },
  },
  () => {
    context('Server Errors', () => {
      it('shows error message on server error (500)', () => {
        cy.interceptStories({
          alias: 'getServerFailure',
          statusCode: 500,
        });

        cy.visit('/');
        cy.wait('@getServerFailure');

        // Explicit assertions - NOT abstracted in functions
        cy.get(SELECTORS.messages.error).should('be.visible');
        cy.get(SELECTORS.messages.error).should('contain', 'Something went wrong');
        cy.get(SELECTORS.stories.item).should('not.exist');
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

        // Explicit assertions - NOT abstracted in functions
        cy.get(SELECTORS.messages.error).should('be.visible');
        cy.get(SELECTORS.messages.error).should('contain', 'Something went wrong');
        cy.get(SELECTORS.stories.item).should('not.exist');
      });
    });
  }
);
