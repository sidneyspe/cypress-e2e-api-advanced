import data from '../../resources/data.config';
import stories from '../../fixtures/stories.json';
import { SELECTORS } from '../../support/selectors';

describe('Order by (Mock)', { env: { snapshotOnly: true } }, () => {
  beforeEach(() => {
    cy.interceptStories({
      term: data.initialTerm,
      alias: 'getStories',
      fixture: 'stories',
    });

    cy.visit('/');
    cy.wait('@getStories');
  });

  context('Sort by Title', () => {
    it('orders by title ascending and descending', () => {
      cy.sortBy('title');
      cy.get(SELECTORS.stories.item)
        .first()
        .should('be.visible')
        .and('contain', stories.hits[0].title);

      cy.get(SELECTORS.stories.itemLink(stories.hits[0].title)).should(
        'have.attr',
        'href',
        stories.hits[0].url
      );

      cy.sortBy('title');
      cy.get(SELECTORS.stories.item)
        .first()
        .should('be.visible')
        .and('contain', stories.hits[1].title);

      cy.get(SELECTORS.stories.itemLink(stories.hits[1].title)).should(
        'have.attr',
        'href',
        stories.hits[1].url
      );
    });
  });

  context('Sort by Author', () => {
    it('orders by author ascending and descending', () => {
      cy.sortBy('author');
      cy.get(SELECTORS.stories.item)
        .first()
        .should('be.visible')
        .and('contain', stories.hits[0].author);

      cy.sortBy('author');
      cy.get(SELECTORS.stories.item)
        .first()
        .should('be.visible')
        .and('contain', stories.hits[1].author);
    });
  });

  context('Sort by Comments', () => {
    it('orders by comments ascending and descending', () => {
      cy.sortBy('comments');
      cy.get(SELECTORS.stories.item)
        .first()
        .should('be.visible')
        .and('contain', stories.hits[1].num_comments);

      cy.sortBy('comments');
      cy.get(SELECTORS.stories.item)
        .first()
        .should('be.visible')
        .and('contain', stories.hits[0].num_comments);
    });
  });

  context('Sort by Points', () => {
    it('orders by points ascending and descending', () => {
      cy.sortBy('points');
      cy.get(SELECTORS.stories.item)
        .first()
        .should('be.visible')
        .and('contain', stories.hits[0].points);

      cy.sortBy('points');
      cy.get(SELECTORS.stories.item)
        .first()
        .should('be.visible')
        .and('contain', stories.hits[1].points);
    });
  });
});
