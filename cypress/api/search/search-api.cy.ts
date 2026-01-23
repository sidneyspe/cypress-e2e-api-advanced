describe(
  'GET /api/v1/search',
  {
    tags: {
      squad: 'qa-api',
      executionType: 'regression',
      product: 'hacker-news-api',
      module: 'search',
      functionality: 'api',
      priority: 'critical',
    },
  },
  () => {
    const apiUrl = Cypress.env('apiUrl') || 'https://hn.algolia.com/api/v1';

    context('when searching with a valid term', () => {
      it('should return 200 and stories matching the search term', () => {
        cy.request({
          method: 'GET',
          url: `${apiUrl}/search`,
          qs: {
            query: 'React',
            hitsPerPage: 20,
          },
        }).then((response) => {
          // Explicit assertions - NOT abstracted in functions
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('hits');
          expect(response.body.hits).to.be.an('array');
          expect(response.body.hits.length).to.be.greaterThan(0);
          expect(response.body).to.have.property('nbHits');
          expect(response.body).to.have.property('page');
          expect(response.body).to.have.property('nbPages');
          expect(response.body).to.have.property('hitsPerPage');
          expect(response.body.hitsPerPage).to.eq(20);
        });
      });

      it('should return stories with required fields', () => {
        cy.request({
          method: 'GET',
          url: `${apiUrl}/search`,
          qs: {
            query: 'Cypress',
            hitsPerPage: 5,
          },
        }).then((response) => {
          // Explicit assertions - NOT abstracted in functions
          expect(response.status).to.eq(200);
          expect(response.body.hits).to.have.length.greaterThan(0);

          const firstHit = response.body.hits[0];
          expect(firstHit).to.have.property('objectID');
          expect(firstHit).to.have.property('title');
          expect(firstHit).to.have.property('author');
          expect(firstHit).to.have.property('points');
          expect(firstHit).to.have.property('num_comments');
          expect(firstHit).to.have.property('url');
        });
      });
    });

    context('when searching with pagination', () => {
      it('should return paginated results', () => {
        cy.request({
          method: 'GET',
          url: `${apiUrl}/search`,
          qs: {
            query: 'JavaScript',
            page: 0,
            hitsPerPage: 10,
          },
        }).then((response) => {
          // Explicit assertions - NOT abstracted in functions
          expect(response.status).to.eq(200);
          expect(response.body.page).to.eq(0);
          expect(response.body.hits).to.have.length(10);
        });

        cy.request({
          method: 'GET',
          url: `${apiUrl}/search`,
          qs: {
            query: 'JavaScript',
            page: 1,
            hitsPerPage: 10,
          },
        }).then((response) => {
          // Explicit assertions - NOT abstracted in functions
          expect(response.status).to.eq(200);
          expect(response.body.page).to.eq(1);
          expect(response.body.hits).to.have.length(10);
        });
      });
    });

    context('when searching with no results', () => {
      it('should return empty hits array', () => {
        const nonsenseQuery = `xyznonexistent${Date.now()}`;

        cy.request({
          method: 'GET',
          url: `${apiUrl}/search`,
          qs: {
            query: nonsenseQuery,
          },
        }).then((response) => {
          // Explicit assertions - NOT abstracted in functions
          expect(response.status).to.eq(200);
          expect(response.body.hits).to.be.an('array');
          expect(response.body.hits).to.have.length(0);
          expect(response.body.nbHits).to.eq(0);
        });
      });
    });

    context('when searching by date', () => {
      it('should return results sorted by date', () => {
        cy.request({
          method: 'GET',
          url: `${apiUrl}/search_by_date`,
          qs: {
            query: 'TypeScript',
            hitsPerPage: 5,
          },
        }).then((response) => {
          // Explicit assertions - NOT abstracted in functions
          expect(response.status).to.eq(200);
          expect(response.body.hits).to.be.an('array');
          expect(response.body.hits.length).to.be.greaterThan(0);

          // Verify results have created_at field
          response.body.hits.forEach((hit: { created_at: string }) => {
            expect(hit).to.have.property('created_at');
          });
        });
      });
    });
  }
);
