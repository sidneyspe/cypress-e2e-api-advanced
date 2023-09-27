import data from '../../../resources/data.config';
import stories from '../../../fixtures/stories.json';

const options = { env: { snapshotOnly: true } };

describe('List of stories', options, () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        pathname: '**/search',
        query: {
          query: data.initialTerm,
          page: '0',
        },
      },
      { fixture: 'stories' }
    ).as('getStories');

    cy.visit('/');

    cy.wait('@getStories');
  });

  it('shows the right data for all rendered stories', () => {
    cy.get('.item')
      .first()
      .should('contain', stories.hits[0].title)
      .and('contain', stories.hits[0].author)
      .and('contain', stories.hits[0].num_comments)
      .and('contain', stories.hits[0].points);
    cy.get(`.item a:contains(${stories.hits[0].title})`).should(
      'have.attr',
      'href',
      stories.hits[0].url
    );

    cy.get('.item')
      .last()
      .should('contain', stories.hits[1].title)
      .and('contain', stories.hits[1].author)
      .and('contain', stories.hits[1].num_comments)
      .and('contain', stories.hits[1].points);
    cy.get(`.item a:contains(${stories.hits[1].title})`).should(
      'have.attr',
      'href',
      stories.hits[1].url
    );
  });

  it('shows only less story after dimissing the first one', () => {
    cy.get('.button-small').first().should('be.visible').click();

    cy.get('.item').should('have.length', 1);
  });
});
