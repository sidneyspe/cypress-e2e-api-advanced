/// <reference types="cypress" />

export interface TestTags {
  /** Squad responsavel pelo teste */
  squad: 'qa-core' | 'qa-platform' | 'qa-mobile' | 'qa-api' | string;

  /** Tipo de execucao */
  executionType: 'smoke' | 'regression' | 'sanity' | 'integration' | 'e2e' | 'api';

  /** Produto sendo testado */
  product: string;

  /** Modulo do sistema */
  module: string;

  /** Funcionalidade especifica */
  functionality: 'e2e' | 'api' | 'unit' | 'integration' | 'visual' | 'accessibility' | 'performance';

  /** Prioridade do teste */
  priority?: 'critical' | 'high' | 'medium' | 'low';

  /** Ambiente alvo */
  targetEnv?: 'dev' | 'staging' | 'production' | 'all';

  /** Tags customizadas adicionais */
  [key: string]: string | undefined;
}

export interface TestConfig {
  env?: {
    snapshotOnly?: boolean;
    [key: string]: unknown;
  };
  tags: TestTags;
}

export interface Story {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: string;
}

export interface StoriesResponse {
  hits: Story[];
  nbHits?: number;
  page?: number;
  nbPages?: number;
  hitsPerPage?: number;
}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to search by pressing Enter
       * @param term - The search term to type
       */
      searchByEnter(term: string): Chainable<void>;

      /**
       * Custom command to search by clicking submit button
       * @param term - The search term to type
       */
      searchBySubmitButton(term: string): Chainable<void>;

      /**
       * Custom command to search by submitting the form
       * @param term - The search term to type
       */
      searchByFormSubmit(term: string): Chainable<void>;

      /**
       * Custom command to dismiss a story by index
       * @param index - The index of the story to dismiss
       */
      dismissStory(index: number): Chainable<void>;

      /**
       * Custom command to sort stories by column
       * @param column - The column to sort by (title, author, comments, points)
       */
      sortBy(column: 'title' | 'author' | 'comments' | 'points'): Chainable<void>;

      /**
       * Custom command to intercept stories API
       * @param options - Options for the intercept
       */
      interceptStories(options?: {
        fixture?: string;
        alias?: string;
        statusCode?: number;
        delay?: number;
        forceNetworkError?: boolean;
      }): Chainable<void>;
    }

    interface SuiteConfigOverrides {
      tags?: TestTags;
    }

    interface TestConfigOverrides {
      tags?: TestTags;
    }
  }
}

export {};
