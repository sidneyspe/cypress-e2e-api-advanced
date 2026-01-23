# CLAUDE.md - Cypress Project Guidelines

## Visão Geral do Projeto

Este documento define as diretrizes, padrões e boas práticas para o projeto de automação de testes utilizando Cypress.

---

## Versão do Cypress

```json
{
  "cypress": "^15.9.0"
}
```

> **Nota:** Sempre manter atualizado para a versão mais recente estável do Cypress.

---

## Estrutura de Pastas do Projeto

```
cypress-project/
├── .editorconfig
├── .eslintrc.js
├── .prettierrc
├── cypress.config.ts
├── package.json
├── tsconfig.json
├── db/
│   ├── test-history.db          # Banco SQLite com histórico de execuções
│   └── migrations/
│       └── init.sql
├── cypress/
│   ├── downloads/
│   ├── fixtures/
│   │   ├── api/
│   │   │   ├── users/
│   │   │   └── products/
│   │   └── e2e/
│   │       ├── search/
│   │       └── checkout/
│   ├── e2e/                      # Testes End-to-End (Frontend)
│   │   ├── search/
│   │   │   ├── search.cy.ts
│   │   │   └── search-filters.cy.ts
│   │   ├── checkout/
│   │   │   ├── cart.cy.ts
│   │   │   └── payment.cy.ts
│   │   └── auth/
│   │       ├── login.cy.ts
│   │       └── register.cy.ts
│   ├── api/                      # Testes de API
│   │   ├── users/
│   │   │   ├── get-users.cy.ts
│   │   │   ├── create-user.cy.ts
│   │   │   └── update-user.cy.ts
│   │   ├── products/
│   │   │   ├── get-products.cy.ts
│   │   │   └── create-product.cy.ts
│   │   └── orders/
│   │       ├── get-orders.cy.ts
│   │       └── create-order.cy.ts
│   ├── support/
│   │   ├── commands.ts
│   │   ├── e2e.ts
│   │   ├── api.ts
│   │   ├── db/
│   │   │   ├── sqlite-client.ts
│   │   │   └── test-result-logger.ts
│   │   ├── selectors/
│   │   │   ├── search.selectors.ts
│   │   │   ├── checkout.selectors.ts
│   │   │   └── auth.selectors.ts
│   │   └── types/
│   │       └── index.d.ts
│   ├── plugins/
│   │   └── index.ts
│   └── artifacts/                # Screenshots e Videos organizados
│       ├── screenshots/
│       │   └── {run_id}/
│       │       └── {spec_name}/
│       │           └── {test_name}--{timestamp}.png
│       └── videos/
│           └── {run_id}/
│               └── {spec_name}.mp4
├── reports/
│   └── html/
└── scripts/
    ├── db-init.ts
    └── cleanup-artifacts.ts
```

---

## Configuração do .editorconfig

```ini
# .editorconfig
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[*.{ts,tsx,js,jsx}]
indent_size = 2

[*.json]
indent_size = 2

[Makefile]
indent_style = tab
```

---

## Configuração do ESLint

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
    'cypress/globals': true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'cypress',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:cypress/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    // Cypress específico
    'cypress/no-assigning-return-values': 'error',
    'cypress/no-unnecessary-waiting': 'error',
    'cypress/assertion-before-screenshot': 'warn',
    'cypress/no-force': 'warn',
    'cypress/no-async-tests': 'error',
    'cypress/no-pause': 'error',

    // TypeScript
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // Geral
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',

    // Prettier
    'prettier/prettier': 'error',
  },
  ignorePatterns: [
    'node_modules/',
    'cypress/artifacts/',
    'reports/',
    'db/',
  ],
};
```

### Dependências ESLint (package.json)

```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-cypress": "^3.0.0",
    "eslint-plugin-prettier": "^5.1.0"
  }
}
```

---

## Configuração do Prettier

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "overrides": [
    {
      "files": "*.json",
      "options": {
        "printWidth": 200
      }
    }
  ]
}
```

---

## Banco de Dados SQLite - Histórico de Execuções

### Schema do Banco de Dados

```sql
-- db/migrations/init.sql

-- Tabela de execuções (runs)
CREATE TABLE IF NOT EXISTS test_runs (
  id TEXT PRIMARY KEY,
  started_at DATETIME NOT NULL,
  finished_at DATETIME,
  status TEXT CHECK(status IN ('running', 'passed', 'failed', 'cancelled')) NOT NULL DEFAULT 'running',
  total_tests INTEGER DEFAULT 0,
  passed_tests INTEGER DEFAULT 0,
  failed_tests INTEGER DEFAULT 0,
  skipped_tests INTEGER DEFAULT 0,
  duration_ms INTEGER,
  browser TEXT,
  browser_version TEXT,
  cypress_version TEXT,
  os TEXT,
  ci_build_id TEXT,
  ci_branch TEXT,
  ci_commit TEXT,
  tags TEXT, -- JSON array de tags
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de specs
CREATE TABLE IF NOT EXISTS test_specs (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  spec_path TEXT NOT NULL,
  started_at DATETIME NOT NULL,
  finished_at DATETIME,
  status TEXT CHECK(status IN ('running', 'passed', 'failed')) NOT NULL DEFAULT 'running',
  total_tests INTEGER DEFAULT 0,
  passed_tests INTEGER DEFAULT 0,
  failed_tests INTEGER DEFAULT 0,
  skipped_tests INTEGER DEFAULT 0,
  duration_ms INTEGER,
  video_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (run_id) REFERENCES test_runs(id) ON DELETE CASCADE
);

-- Tabela de testes individuais
CREATE TABLE IF NOT EXISTS test_cases (
  id TEXT PRIMARY KEY,
  spec_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  title TEXT NOT NULL,
  full_title TEXT NOT NULL,
  status TEXT CHECK(status IN ('passed', 'failed', 'skipped', 'pending')) NOT NULL,
  duration_ms INTEGER,
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  error_stack TEXT,
  code_snippet TEXT,
  -- Tags do teste
  tag_squad TEXT,
  tag_execution_type TEXT,
  tag_product TEXT,
  tag_module TEXT,
  tag_functionality TEXT,
  tags_json TEXT, -- JSON com todas as tags
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (spec_id) REFERENCES test_specs(id) ON DELETE CASCADE,
  FOREIGN KEY (run_id) REFERENCES test_runs(id) ON DELETE CASCADE
);

-- Tabela de artefatos (screenshots, videos, logs)
CREATE TABLE IF NOT EXISTS test_artifacts (
  id TEXT PRIMARY KEY,
  test_case_id TEXT,
  spec_id TEXT,
  run_id TEXT NOT NULL,
  artifact_type TEXT CHECK(artifact_type IN ('screenshot', 'video', 'log', 'trace', 'har')) NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_bytes INTEGER,
  mime_type TEXT,
  -- Metadados específicos para screenshots de erro
  is_failure_screenshot BOOLEAN DEFAULT FALSE,
  screenshot_at_command TEXT,
  screenshot_timestamp DATETIME,
  -- Referência ao erro/bug
  error_hash TEXT, -- Hash único para agrupar erros similares
  error_category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_case_id) REFERENCES test_cases(id) ON DELETE CASCADE,
  FOREIGN KEY (spec_id) REFERENCES test_specs(id) ON DELETE CASCADE,
  FOREIGN KEY (run_id) REFERENCES test_runs(id) ON DELETE CASCADE
);

-- Tabela de bugs/erros catalogados
CREATE TABLE IF NOT EXISTS cataloged_bugs (
  id TEXT PRIMARY KEY,
  error_hash TEXT UNIQUE NOT NULL,
  error_message TEXT NOT NULL,
  error_pattern TEXT, -- Regex ou padrão para identificar o erro
  first_seen_at DATETIME NOT NULL,
  last_seen_at DATETIME NOT NULL,
  occurrence_count INTEGER DEFAULT 1,
  status TEXT CHECK(status IN ('new', 'investigating', 'known', 'fixed', 'wont_fix')) DEFAULT 'new',
  jira_ticket TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_test_runs_status ON test_runs(status);
CREATE INDEX IF NOT EXISTS idx_test_runs_started_at ON test_runs(started_at);
CREATE INDEX IF NOT EXISTS idx_test_specs_run_id ON test_specs(run_id);
CREATE INDEX IF NOT EXISTS idx_test_cases_run_id ON test_cases(run_id);
CREATE INDEX IF NOT EXISTS idx_test_cases_status ON test_cases(status);
CREATE INDEX IF NOT EXISTS idx_test_artifacts_run_id ON test_artifacts(run_id);
CREATE INDEX IF NOT EXISTS idx_test_artifacts_error_hash ON test_artifacts(error_hash);
CREATE INDEX IF NOT EXISTS idx_cataloged_bugs_error_hash ON cataloged_bugs(error_hash);

-- Views úteis
CREATE VIEW IF NOT EXISTS v_failed_tests_with_artifacts AS
SELECT
  tc.id as test_id,
  tc.full_title,
  tc.error_message,
  tc.tag_squad,
  tc.tag_module,
  ta.file_path as screenshot_path,
  ts.video_path,
  tr.ci_branch,
  tr.ci_commit,
  tc.created_at
FROM test_cases tc
JOIN test_specs ts ON tc.spec_id = ts.id
JOIN test_runs tr ON tc.run_id = tr.id
LEFT JOIN test_artifacts ta ON ta.test_case_id = tc.id AND ta.artifact_type = 'screenshot'
WHERE tc.status = 'failed'
ORDER BY tc.created_at DESC;

CREATE VIEW IF NOT EXISTS v_bug_frequency AS
SELECT
  cb.error_hash,
  cb.error_message,
  cb.status,
  cb.occurrence_count,
  cb.jira_ticket,
  COUNT(DISTINCT ta.id) as artifact_count,
  cb.first_seen_at,
  cb.last_seen_at
FROM cataloged_bugs cb
LEFT JOIN test_artifacts ta ON ta.error_hash = cb.error_hash
GROUP BY cb.id
ORDER BY cb.occurrence_count DESC;
```

### Cliente SQLite para Cypress

```typescript
// cypress/support/db/sqlite-client.ts
import Database from 'better-sqlite3';
import * as path from 'path';
import * as crypto from 'crypto';

const DB_PATH = path.join(__dirname, '../../../db/test-history.db');

export interface TestRun {
  id: string;
  started_at: string;
  finished_at?: string;
  status: 'running' | 'passed' | 'failed' | 'cancelled';
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  skipped_tests: number;
  duration_ms?: number;
  browser?: string;
  browser_version?: string;
  cypress_version?: string;
  os?: string;
  ci_build_id?: string;
  ci_branch?: string;
  ci_commit?: string;
  tags?: string;
}

export interface TestCase {
  id: string;
  spec_id: string;
  run_id: string;
  title: string;
  full_title: string;
  status: 'passed' | 'failed' | 'skipped' | 'pending';
  duration_ms?: number;
  retry_count?: number;
  error_message?: string;
  error_stack?: string;
  code_snippet?: string;
  tag_squad?: string;
  tag_execution_type?: string;
  tag_product?: string;
  tag_module?: string;
  tag_functionality?: string;
  tags_json?: string;
}

export interface TestArtifact {
  id: string;
  test_case_id?: string;
  spec_id?: string;
  run_id: string;
  artifact_type: 'screenshot' | 'video' | 'log' | 'trace' | 'har';
  file_path: string;
  file_name: string;
  file_size_bytes?: number;
  mime_type?: string;
  is_failure_screenshot?: boolean;
  screenshot_at_command?: string;
  screenshot_timestamp?: string;
  error_hash?: string;
  error_category?: string;
}

export class SQLiteClient {
  private db: Database.Database;

  constructor() {
    this.db = new Database(DB_PATH);
    this.db.pragma('journal_mode = WAL');
  }

  generateId(): string {
    return crypto.randomUUID();
  }

  generateErrorHash(errorMessage: string): string {
    // Normaliza a mensagem de erro removendo dados dinâmicos
    const normalized = errorMessage
      .replace(/\d+/g, 'N') // Substitui números
      .replace(/0x[a-fA-F0-9]+/g, 'ADDR') // Substitui endereços de memória
      .replace(/at line \d+/gi, 'at line N')
      .trim()
      .toLowerCase();

    return crypto.createHash('md5').update(normalized).digest('hex').substring(0, 16);
  }

  // Test Runs
  createTestRun(run: Partial<TestRun>): string {
    const id = run.id || this.generateId();
    const stmt = this.db.prepare(`
      INSERT INTO test_runs (id, started_at, status, browser, browser_version, cypress_version, os, ci_build_id, ci_branch, ci_commit, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      run.started_at || new Date().toISOString(),
      run.status || 'running',
      run.browser,
      run.browser_version,
      run.cypress_version,
      run.os,
      run.ci_build_id,
      run.ci_branch,
      run.ci_commit,
      run.tags
    );

    return id;
  }

  updateTestRun(id: string, updates: Partial<TestRun>): void {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = Object.values(updates);

    const stmt = this.db.prepare(`UPDATE test_runs SET ${fields} WHERE id = ?`);
    stmt.run(...values, id);
  }

  // Test Cases
  createTestCase(testCase: TestCase): string {
    const stmt = this.db.prepare(`
      INSERT INTO test_cases (id, spec_id, run_id, title, full_title, status, duration_ms, retry_count, error_message, error_stack, code_snippet, tag_squad, tag_execution_type, tag_product, tag_module, tag_functionality, tags_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      testCase.id,
      testCase.spec_id,
      testCase.run_id,
      testCase.title,
      testCase.full_title,
      testCase.status,
      testCase.duration_ms,
      testCase.retry_count || 0,
      testCase.error_message,
      testCase.error_stack,
      testCase.code_snippet,
      testCase.tag_squad,
      testCase.tag_execution_type,
      testCase.tag_product,
      testCase.tag_module,
      testCase.tag_functionality,
      testCase.tags_json
    );

    return testCase.id;
  }

  // Artifacts
  createArtifact(artifact: TestArtifact): string {
    const stmt = this.db.prepare(`
      INSERT INTO test_artifacts (id, test_case_id, spec_id, run_id, artifact_type, file_path, file_name, file_size_bytes, mime_type, is_failure_screenshot, screenshot_at_command, screenshot_timestamp, error_hash, error_category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      artifact.id,
      artifact.test_case_id,
      artifact.spec_id,
      artifact.run_id,
      artifact.artifact_type,
      artifact.file_path,
      artifact.file_name,
      artifact.file_size_bytes,
      artifact.mime_type,
      artifact.is_failure_screenshot ? 1 : 0,
      artifact.screenshot_at_command,
      artifact.screenshot_timestamp,
      artifact.error_hash,
      artifact.error_category
    );

    return artifact.id;
  }

  // Cataloged Bugs
  upsertBug(errorHash: string, errorMessage: string): void {
    const existing = this.db.prepare('SELECT id FROM cataloged_bugs WHERE error_hash = ?').get(errorHash);

    if (existing) {
      this.db.prepare(`
        UPDATE cataloged_bugs
        SET occurrence_count = occurrence_count + 1,
            last_seen_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE error_hash = ?
      `).run(errorHash);
    } else {
      this.db.prepare(`
        INSERT INTO cataloged_bugs (id, error_hash, error_message, first_seen_at, last_seen_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).run(this.generateId(), errorHash, errorMessage);
    }
  }

  // Queries úteis
  getFailedTestsWithArtifacts(runId?: string): any[] {
    let query = 'SELECT * FROM v_failed_tests_with_artifacts';
    if (runId) {
      query += ' WHERE run_id = ?';
      return this.db.prepare(query).all(runId);
    }
    return this.db.prepare(query).all();
  }

  getBugFrequency(): any[] {
    return this.db.prepare('SELECT * FROM v_bug_frequency').all();
  }

  close(): void {
    this.db.close();
  }
}

export const dbClient = new SQLiteClient();
```

---

## Configuração do Cypress (cypress.config.ts)

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';
import * as path from 'path';
import * as fs from 'fs';
import { dbClient, SQLiteClient } from './cypress/support/db/sqlite-client';

// Gera ID único para cada execução
const generateRunId = () => `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export default defineConfig({
  // Versão do Cypress
  // cypress: 15.9.0

  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: [
      'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
      'cypress/api/**/*.cy.{js,jsx,ts,tsx}',
    ],
    supportFile: 'cypress/support/e2e.ts',
    experimentalRunAllSpecs: true,

    setupNodeEvents(on, config) {
      const runId = generateRunId();
      const artifactsDir = path.join('cypress', 'artifacts');

      // Cria diretório de artefatos para esta execução
      const runArtifactsDir = path.join(artifactsDir, 'screenshots', runId);
      const runVideosDir = path.join(artifactsDir, 'videos', runId);

      fs.mkdirSync(runArtifactsDir, { recursive: true });
      fs.mkdirSync(runVideosDir, { recursive: true });

      // Registra início da execução no banco
      dbClient.createTestRun({
        id: runId,
        started_at: new Date().toISOString(),
        browser: config.browser?.name,
        browser_version: config.browser?.version,
        cypress_version: config.version,
        os: process.platform,
        ci_build_id: process.env.CI_BUILD_ID,
        ci_branch: process.env.CI_BRANCH || process.env.GITHUB_REF_NAME,
        ci_commit: process.env.CI_COMMIT || process.env.GITHUB_SHA,
      });

      // Task para salvar resultados no banco
      on('task', {
        logTestResult({ testCase, specId }) {
          return dbClient.createTestCase({
            ...testCase,
            spec_id: specId,
            run_id: runId,
          });
        },

        logArtifact(artifact) {
          return dbClient.createArtifact({
            ...artifact,
            run_id: runId,
          });
        },

        catalogBug({ errorHash, errorMessage }) {
          dbClient.upsertBug(errorHash, errorMessage);
          return null;
        },

        getRunId() {
          return runId;
        },

        generateErrorHash(errorMessage: string) {
          return dbClient.generateErrorHash(errorMessage);
        },
      });

      // Processa screenshots para catalogar bugs
      on('after:screenshot', (details) => {
        const screenshotRunDir = path.join(runArtifactsDir, details.specName);
        fs.mkdirSync(screenshotRunDir, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const newFileName = `${details.name || 'screenshot'}--${timestamp}.png`;
        const newPath = path.join(screenshotRunDir, newFileName);

        fs.renameSync(details.path, newPath);

        // Se for screenshot de falha, cataloga o bug
        if (details.testFailure) {
          const errorHash = dbClient.generateErrorHash(details.name || 'unknown-error');

          dbClient.createArtifact({
            id: dbClient.generateId(),
            run_id: runId,
            artifact_type: 'screenshot',
            file_path: newPath,
            file_name: newFileName,
            file_size_bytes: fs.statSync(newPath).size,
            mime_type: 'image/png',
            is_failure_screenshot: true,
            screenshot_timestamp: new Date().toISOString(),
            error_hash: errorHash,
          });

          dbClient.upsertBug(errorHash, details.name || 'Unknown error');
        }

        return { path: newPath };
      });

      // Processa vídeos
      on('after:spec', (spec, results) => {
        if (results?.video) {
          const videoFileName = path.basename(results.video);
          const newVideoPath = path.join(runVideosDir, videoFileName);

          fs.renameSync(results.video, newVideoPath);

          dbClient.createArtifact({
            id: dbClient.generateId(),
            run_id: runId,
            artifact_type: 'video',
            file_path: newVideoPath,
            file_name: videoFileName,
            file_size_bytes: fs.statSync(newVideoPath).size,
            mime_type: 'video/mp4',
          });
        }
      });

      // Finaliza a execução no banco
      on('after:run', (results) => {
        dbClient.updateTestRun(runId, {
          finished_at: new Date().toISOString(),
          status: results.totalFailed > 0 ? 'failed' : 'passed',
          total_tests: results.totalTests,
          passed_tests: results.totalPassed,
          failed_tests: results.totalFailed,
          skipped_tests: results.totalSkipped,
          duration_ms: results.totalDuration,
        });

        dbClient.close();
      });

      return config;
    },
  },

  // Configurações de vídeo e screenshot
  video: true,
  videoCompression: 32,
  screenshotOnRunFailure: true,
  screenshotsFolder: 'cypress/artifacts/screenshots',
  videosFolder: 'cypress/artifacts/videos',
  trashAssetsBeforeRuns: false, // Mantemos histórico

  // Configurações de retry
  retries: {
    runMode: 2,
    openMode: 0,
  },

  // Timeouts
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 60000,
  requestTimeout: 10000,
  responseTimeout: 30000,

  // Viewport padrão
  viewportWidth: 1280,
  viewportHeight: 720,

  // Configurações de ambiente
  env: {
    apiUrl: 'http://localhost:3001/api',
    coverage: false,
  },

  // Component Testing (opcional)
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },
});
```

---

## Sistema de Tags para Testes

### Definição de Tags

```typescript
// cypress/support/types/tags.ts

export interface TestTags {
  /** Squad responsável pelo teste */
  squad: 'qa-core' | 'qa-platform' | 'qa-mobile' | 'qa-api' | string;

  /** Tipo de execução */
  executionType: 'smoke' | 'regression' | 'sanity' | 'integration' | 'e2e' | 'api';

  /** Produto sendo testado */
  product: string;

  /** Módulo do sistema */
  module: string;

  /** Funcionalidade específica */
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
    [key: string]: any;
  };
  tags: TestTags;
}
```

### Exemplo de Uso das Tags

```typescript
// cypress/e2e/search/search.cy.ts
import { SELECTORS } from '../../support/selectors/search.selectors';
import * as data from '../../fixtures/e2e/search/search-data.json';

describe('Search', {
  env: { snapshotOnly: true },
  tags: {
    squad: 'qa-core',
    executionType: 'smoke',
    product: 'hacker-stories',
    module: 'search',
    functionality: 'e2e',
    priority: 'critical',
  },
}, () => {
  beforeEach(() => {
    cy.visit('/');
    cy.intercept('GET', '**/api/search*', { fixture: 'e2e/search/stories.json' }).as('getStories');
    cy.get(SELECTORS.search.input).should('be.visible').clear();
  });

  it('should display search results when typing a valid term', () => {
    // ✅ BOM: Assertions explícitas e claras
    cy.get(SELECTORS.search.input).type(data.searchTerm);

    cy.wait('@getStories');

    // Assertions explícitas - NÃO abstrair em funções
    cy.get(SELECTORS.search.resultsList).should('be.visible');
    cy.get(SELECTORS.search.resultItem).should('have.length.greaterThan', 0);
    cy.get(SELECTORS.search.resultItem).first().should('contain.text', data.expectedResult);
    cy.get(SELECTORS.search.noResults).should('not.exist');
  });

  it('should show no results message for invalid search', () => {
    cy.get(SELECTORS.search.input).type(data.invalidSearchTerm);

    cy.wait('@getStories');

    // Assertions explícitas - NÃO abstrair em funções
    cy.get(SELECTORS.search.noResults).should('be.visible');
    cy.get(SELECTORS.search.noResults).should('contain.text', 'No results found');
    cy.get(SELECTORS.search.resultItem).should('not.exist');
  });

  it('should clear results when search input is cleared', () => {
    cy.get(SELECTORS.search.input).type(data.searchTerm);
    cy.wait('@getStories');
    cy.get(SELECTORS.search.resultItem).should('have.length.greaterThan', 0);

    cy.get(SELECTORS.search.input).clear();

    // Assertions explícitas - repetição é aceitável para clareza
    cy.get(SELECTORS.search.resultItem).should('not.exist');
    cy.get(SELECTORS.search.placeholder).should('be.visible');
  });
});
```

---

## ⚠️ REGRAS CRÍTICAS: Assertions Explícitas (NÃO ABSTRAIR)

### Filosofia

**Conforme recomendação da documentação oficial do Cypress, assertions NÃO devem ser abstraídas em funções ou page objects.** A repetição de assertions é vista como uma boa prática pois:

1. **Facilidade de leitura**: O teste deve ser auto-explicativo sobre o que está validando
2. **Debugging simplificado**: Não é necessário navegar para outro arquivo para entender a validação
3. **Manutenção**: Alterações são feitas diretamente no teste, sem efeitos colaterais
4. **Clareza**: Cada teste documenta exatamente suas expectativas

### ❌ O QUE NÃO FAZER

```typescript
// ❌ ERRADO: Assertions abstraídas em funções
// cypress/support/assertions/search.assertions.ts
export function assertSearchResultsVisible() {
  cy.get('[data-testid="results-list"]').should('be.visible');
  cy.get('[data-testid="result-item"]').should('have.length.greaterThan', 0);
}

// ❌ ERRADO: Assertions em Page Objects
class SearchPage {
  assertResultsDisplayed() {
    cy.get(this.selectors.results).should('be.visible');
  }
}

// ❌ ERRADO: Uso no teste
it('should display results', () => {
  cy.visit('/');
  searchPage.search('react');
  searchPage.assertResultsDisplayed(); // O que está sendo validado? Preciso ir em outro arquivo ver
});
```

### ✅ O QUE FAZER

```typescript
// ✅ CORRETO: Assertions explícitas no próprio teste
it('should display search results when typing a valid term', () => {
  cy.visit('/');

  cy.get('[data-testid="search-input"]').type('react');

  // Assertions claras e explícitas - qualquer um lendo entende o que está sendo validado
  cy.get('[data-testid="results-list"]').should('be.visible');
  cy.get('[data-testid="result-item"]').should('have.length.greaterThan', 0);
  cy.get('[data-testid="result-item"]').first().should('contain.text', 'React');
  cy.get('[data-testid="loading-spinner"]').should('not.exist');
  cy.get('[data-testid="error-message"]').should('not.exist');
});

// ✅ CORRETO: Repetição de assertions entre testes é aceitável
it('should filter results by category', () => {
  cy.visit('/');

  cy.get('[data-testid="search-input"]').type('react');
  cy.get('[data-testid="category-filter"]').select('tutorials');

  // Mesmas assertions repetidas - isso é ACEITÁVEL e RECOMENDADO
  cy.get('[data-testid="results-list"]').should('be.visible');
  cy.get('[data-testid="result-item"]').should('have.length.greaterThan', 0);
  cy.get('[data-testid="result-item"]').each(($item) => {
    cy.wrap($item).should('contain.text', 'Tutorial');
  });
});
```

### O que PODE ser abstraído

- **Seletores**: Podem e devem ser centralizados para evitar strings hardcoded
- **Ações de setup**: Login, navegação, intercepts
- **Comandos customizados**: Para ações repetitivas (NÃO para assertions)
- **Fixtures e dados de teste**

```typescript
// ✅ CORRETO: Seletores centralizados
// cypress/support/selectors/search.selectors.ts
export const SELECTORS = {
  search: {
    input: '[data-testid="search-input"]',
    resultsList: '[data-testid="results-list"]',
    resultItem: '[data-testid="result-item"]',
    noResults: '[data-testid="no-results"]',
    loading: '[data-testid="loading-spinner"]',
  },
};

// ✅ CORRETO: Comando customizado para AÇÃO (não assertion)
// cypress/support/commands.ts
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('not.include', '/login');
  });
});

// ✅ CORRETO: Uso no teste com assertions explícitas
it('should show user dashboard after login', () => {
  cy.login('user@test.com', 'password123'); // Ação abstraída ✅

  // Assertions explícitas no teste ✅
  cy.get('[data-testid="dashboard"]').should('be.visible');
  cy.get('[data-testid="welcome-message"]').should('contain.text', 'Welcome');
  cy.get('[data-testid="user-avatar"]').should('be.visible');
  cy.get('[data-testid="logout-button"]').should('exist');
});
```

---

## Estrutura de Testes de API

### Organização

```
cypress/api/
├── users/
│   ├── get-users.cy.ts
│   ├── get-user-by-id.cy.ts
│   ├── create-user.cy.ts
│   ├── update-user.cy.ts
│   └── delete-user.cy.ts
├── products/
│   ├── get-products.cy.ts
│   ├── get-product-by-id.cy.ts
│   ├── create-product.cy.ts
│   └── update-product.cy.ts
├── orders/
│   ├── get-orders.cy.ts
│   ├── create-order.cy.ts
│   └── cancel-order.cy.ts
└── auth/
    ├── login.cy.ts
    ├── logout.cy.ts
    └── refresh-token.cy.ts
```

### Exemplo de Teste de API

```typescript
// cypress/api/users/create-user.cy.ts

describe('POST /api/users', {
  tags: {
    squad: 'qa-api',
    executionType: 'regression',
    product: 'user-service',
    module: 'users',
    functionality: 'api',
    priority: 'critical',
  },
}, () => {
  const apiUrl = Cypress.env('apiUrl');

  context('when creating a valid user', () => {
    it('should return 201 and the created user', () => {
      const newUser = {
        name: 'John Doe',
        email: `john.doe.${Date.now()}@test.com`,
        role: 'user',
      };

      cy.request({
        method: 'POST',
        url: `${apiUrl}/users`,
        body: newUser,
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        // ✅ Assertions explícitas para API
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.id).to.be.a('string');
        expect(response.body.name).to.eq(newUser.name);
        expect(response.body.email).to.eq(newUser.email);
        expect(response.body.role).to.eq(newUser.role);
        expect(response.body).to.have.property('createdAt');
        expect(response.body).to.have.property('updatedAt');
      });
    });
  });

  context('when creating a user with invalid data', () => {
    it('should return 400 for missing required fields', () => {
      const invalidUser = {
        name: 'John Doe',
        // email is missing
      };

      cy.request({
        method: 'POST',
        url: `${apiUrl}/users`,
        body: invalidUser,
        failOnStatusCode: false,
      }).then((response) => {
        // ✅ Assertions explícitas
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.include('email');
        expect(response.body).to.have.property('message');
      });
    });

    it('should return 400 for invalid email format', () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'not-an-email',
      };

      cy.request({
        method: 'POST',
        url: `${apiUrl}/users`,
        body: invalidUser,
        failOnStatusCode: false,
      }).then((response) => {
        // ✅ Assertions explícitas
        expect(response.status).to.eq(400);
        expect(response.body.error).to.include('email');
        expect(response.body.message).to.match(/invalid.*email/i);
      });
    });

    it('should return 409 for duplicate email', () => {
      const existingEmail = 'existing@test.com';

      // Primeiro cria um usuário
      cy.request({
        method: 'POST',
        url: `${apiUrl}/users`,
        body: {
          name: 'First User',
          email: existingEmail,
        },
      });

      // Tenta criar outro com mesmo email
      cy.request({
        method: 'POST',
        url: `${apiUrl}/users`,
        body: {
          name: 'Second User',
          email: existingEmail,
        },
        failOnStatusCode: false,
      }).then((response) => {
        // ✅ Assertions explícitas
        expect(response.status).to.eq(409);
        expect(response.body.error).to.eq('DUPLICATE_EMAIL');
        expect(response.body.message).to.include('already exists');
      });
    });
  });
});
```

---

## Boas Práticas Cypress (Documentação Oficial)

### 1. Não use `cy.wait()` com tempo fixo

```typescript
// ❌ ERRADO
cy.wait(5000);

// ✅ CORRETO
cy.intercept('GET', '/api/data').as('getData');
cy.wait('@getData');
```

### 2. Use aliases para intercepts

```typescript
// ✅ CORRETO
cy.intercept('POST', '/api/users').as('createUser');
cy.get('[data-testid="submit"]').click();
cy.wait('@createUser').its('response.statusCode').should('eq', 201);
```

### 3. Seleção de elementos

```typescript
// ❌ ERRADO - Frágil
cy.get('.btn-primary');
cy.get('#submit-btn');
cy.get('button:nth-child(2)');

// ✅ CORRETO - Resiliente
cy.get('[data-testid="submit-button"]');
cy.get('[data-cy="submit-button"]');
```

### 4. Não compartilhe estado entre testes

```typescript
// ❌ ERRADO
let userId;

it('creates user', () => {
  cy.request('POST', '/api/users').then((res) => {
    userId = res.body.id;
  });
});

it('gets user', () => {
  cy.request('GET', `/api/users/${userId}`); // Depende do teste anterior
});

// ✅ CORRETO
it('creates and retrieves user', () => {
  cy.request('POST', '/api/users').then((res) => {
    const userId = res.body.id;
    cy.request('GET', `/api/users/${userId}`).then((response) => {
      expect(response.body.id).to.eq(userId);
    });
  });
});
```

### 5. Use `beforeEach` ao invés de `before` quando possível

```typescript
// ✅ CORRETO - Cada teste é isolado
beforeEach(() => {
  cy.visit('/');
  cy.intercept('GET', '/api/data').as('getData');
});
```

### 6. Evite condicionais no código de teste

```typescript
// ❌ ERRADO
cy.get('body').then(($body) => {
  if ($body.find('[data-testid="modal"]').length > 0) {
    cy.get('[data-testid="close-modal"]').click();
  }
});

// ✅ CORRETO - Garanta um estado consistente no setup
beforeEach(() => {
  cy.clearLocalStorage();
  cy.visit('/');
});
```

### 7. Use `.should()` para assertions com retry automático

```typescript
// ✅ CORRETO - Cypress fará retry automaticamente
cy.get('[data-testid="status"]').should('contain.text', 'Success');
cy.get('[data-testid="list"]').should('have.length', 5);
```

### 8. Configure base URL

```typescript
// cypress.config.ts
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
  },
});

// No teste
cy.visit('/dashboard'); // ao invés de cy.visit('http://localhost:3000/dashboard')
```

---

## Scripts NPM

```json
{
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "cy:run:e2e": "cypress run --spec 'cypress/e2e/**/*.cy.ts'",
    "cy:run:api": "cypress run --spec 'cypress/api/**/*.cy.ts'",
    "cy:run:smoke": "cypress run --env grepTags=smoke",
    "cy:run:regression": "cypress run --env grepTags=regression",
    "cy:run:squad:core": "cypress run --env grepTags='@squad:qa-core'",
    "db:init": "ts-node scripts/db-init.ts",
    "db:report": "ts-node scripts/generate-report.ts",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

---

## Dependências do Projeto (package.json completo)

```json
{
  "name": "cypress-project",
  "version": "1.0.0",
  "description": "Projeto de automação de testes com Cypress",
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "cy:run:e2e": "cypress run --spec 'cypress/e2e/**/*.cy.ts'",
    "cy:run:api": "cypress run --spec 'cypress/api/**/*.cy.ts'",
    "cy:run:smoke": "cypress run --env grepTags=smoke",
    "cy:run:regression": "cypress run --env grepTags=regression",
    "db:init": "ts-node scripts/db-init.ts",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.8",
    "@types/node": "^20.11.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "better-sqlite3": "^11.0.0",
    "cypress": "^15.9.0",
    "cypress-grep": "^4.1.0",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-cypress": "^3.0.0",
    "eslint-plugin-prettier": "^5.1.0",
    "prettier": "^3.2.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.0"
  }
}
```

---

## Checklist de Implementação

- [ ] Criar estrutura de pastas conforme definido
- [ ] Configurar `.editorconfig`
- [ ] Configurar ESLint (`.eslintrc.js`)
- [ ] Configurar Prettier (`.prettierrc`)
- [ ] Inicializar banco de dados SQLite
- [ ] Implementar cliente SQLite
- [ ] Configurar `cypress.config.ts` com hooks de eventos
- [ ] Criar selectors centralizados
- [ ] Criar fixtures de teste
- [ ] Implementar primeiros testes E2E com tags
- [ ] Implementar primeiros testes de API com tags
- [ ] Validar armazenamento de artefatos
- [ ] Validar catalogação de bugs no banco

---

## Referências

- [Cypress Documentation](https://docs.cypress.io)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress API Reference](https://docs.cypress.io/api/table-of-contents)
- [Cypress Changelog](https://docs.cypress.io/guides/references/changelog)
