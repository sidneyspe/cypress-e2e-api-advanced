import data from '../../../resources/data.config';
import stories from '../../../fixtures/stories.json';

const options = { env: { snapshotOnly: true } };

describe('Order by', options, () => {
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

  it('orders by title', () => {
    cy.get('.list-header-button:contains(Title)')
      .as('titleHeader')
      .should('be.visible')
      .click();

    cy.get('.item')
      .first()
      .should('be.visible')
      .and('contain', stories.hits[0].title);

    cy.get(`.item a:contains(${stories.hits[0].title})`).should(
      'have.attr',
      'href',
      stories.hits[0].url
    );

    cy.get('@titleHeader').should('be.visible').click();

    cy.get('.item')
      .first()
      .should('be.visible')
      .and('contain', stories.hits[1].title);

    cy.get(`.item a:contains(${stories.hits[1].title})`).should(
      'have.attr',
      'href',
      stories.hits[1].url
    );
  });

  it('orders by author', () => {
    cy.get('.list-header-button:contains(Author)')
      .as('authorHeader')
      .should('be.visible')
      .click();

    cy.get('.item')
      .first()
      .should('be.visible')
      .and('contain', stories.hits[0].author);

    cy.get('@authorHeader').should('be.visible').click();

    cy.get('.item')
      .first()
      .should('be.visible')
      .and('contain', stories.hits[1].author);
  });

  it('orders by comments', () => {
    cy.get('.list-header-button:contains(Comments)')
      .as('commentsHeader')
      .should('be.visible')
      .click();

    cy.get('.item')
      .first()
      .should('be.visible')
      .and('contain', stories.hits[1].num_comments);

    cy.get('@commentsHeader').should('be.visible').click();

    cy.get('.item')
      .first()
      .should('be.visible')
      .and('contain', stories.hits[0].num_comments);
  });

  it('orders by points', () => {
    cy.get('.list-header-button:contains(Title)')
      .as('pointsHeader')
      .should('be.visible')
      .click();

    cy.get('.item')
      .first()
      .should('be.visible')
      .and('contain', stories.hits[0].points);

    cy.get('@pointsHeader').should('be.visible').click();

    cy.get('.item')
      .first()
      .should('be.visible')
      .and('contain', stories.hits[1].points);
  });
});
