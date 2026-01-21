const options = { env: { snapshotOnly: true } };

describe('List of stories', options, () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        pathname: '**/search**',
      },
      { delay: 1000, fixture: 'stories' }
    ).as('getDelayedStories');
  });

  it('shows a "Loading ..." state before showing the results', () => {
    cy.visit('/');

    cy.assertLoadingIsShownAndHidden();
    cy.wait('@getDelayedStories');

    cy.get('.item').should('have.length', 2);
  });
});
