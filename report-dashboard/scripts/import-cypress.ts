#!/usr/bin/env bun
import fs from 'fs';
import path from 'path';
import { Database } from 'bun:sqlite';

// Default path relative to the report-dashboard folder
const DEFAULT_REPORT_PATH = '../cypress/results/output.json';
const REPORT_PATH = process.argv[2] || DEFAULT_REPORT_PATH;
const CYPRESS_ROOT = path.resolve(process.cwd(), '..');

interface MochawesomeResult {
  stats: {
    suites: number;
    tests: number;
    passes: number;
    failures: number;
    pending: number;
    skipped: number;
    duration: number;
    start: string;
    end: string;
    passPercent?: number;
  };
  results: Array<{
    uuid: string;
    title: string;
    fullFile: string;
    file: string;
    suites: Suite[];
  }>;
}

interface Suite {
  uuid: string;
  title: string;
  fullFile?: string;
  file?: string;
  tests: Test[];
  suites?: Suite[];
}

interface Test {
  uuid: string;
  title: string;
  fullTitle: string;
  state: string;
  pass: boolean;
  fail: boolean;
  pending: boolean;
  skipped?: boolean;
  duration: number;
  speed?: string;
  code?: string;
  err?: {
    message?: string;
    estack?: string;
    stack?: string;
  };
}

interface Tags {
  squad?: string;
  executionType?: string;
  product?: string;
  module?: string;
  functionality?: string;
}

function extractTagsFromFile(filePath: string): Tags {
  const tags: Tags = {};

  try {
    // Convert Windows path separators and resolve the path
    const normalizedPath = filePath.replace(/\\/g, '/');
    const absolutePath = path.resolve(CYPRESS_ROOT, normalizedPath);

    if (!fs.existsSync(absolutePath)) {
      console.log(`  File not found: ${absolutePath}`);
      return tags;
    }

    const content = fs.readFileSync(absolutePath, 'utf-8');

    // Extract tags from describe block with tags object
    // Match tags: { squad: 'value', ... }
    const tagsBlockMatch = content.match(/tags:\s*\{([^}]+)\}/s);
    if (tagsBlockMatch) {
      const tagsContent = tagsBlockMatch[1];

      // Extract each tag value
      const squadMatch = tagsContent.match(/squad:\s*['"]([^'"]+)['"]/);
      if (squadMatch) tags.squad = squadMatch[1];

      const executionTypeMatch = tagsContent.match(/executionType:\s*['"]([^'"]+)['"]/);
      if (executionTypeMatch) tags.executionType = executionTypeMatch[1];

      const productMatch = tagsContent.match(/product:\s*['"]([^'"]+)['"]/);
      if (productMatch) tags.product = productMatch[1];

      const moduleMatch = tagsContent.match(/module:\s*['"]([^'"]+)['"]/);
      if (moduleMatch) tags.module = moduleMatch[1];

      const functionalityMatch = tagsContent.match(/functionality:\s*['"]([^'"]+)['"]/);
      if (functionalityMatch) tags.functionality = functionalityMatch[1];
    }

    // Also try comment-based tags as fallback
    if (!tags.squad) {
      const commentTagPatterns = [
        { key: 'squad' as keyof Tags, pattern: /@squad[:\s]+([^\n\r]+)/i },
        { key: 'executionType' as keyof Tags, pattern: /@executionType[:\s]+([^\n\r]+)/i },
        { key: 'product' as keyof Tags, pattern: /@product[:\s]+([^\n\r]+)/i },
        { key: 'module' as keyof Tags, pattern: /@module[:\s]+([^\n\r]+)/i },
        { key: 'functionality' as keyof Tags, pattern: /@functionality[:\s]+([^\n\r]+)/i },
      ];

      commentTagPatterns.forEach(({ key, pattern }) => {
        if (!tags[key]) {
          const match = content.match(pattern);
          if (match) {
            tags[key] = match[1].trim();
          }
        }
      });
    }

    if (Object.keys(tags).length > 0) {
      console.log(`  Tags found in ${normalizedPath}:`, tags);
    }
  } catch (error) {
    console.error(`  Error reading file ${filePath}:`, error);
  }

  return tags;
}

interface ProcessedTest {
  testId: string;
  uuid: string;
  title: string;
  fullTitle: string;
  suitePath: string;
  file: string;
  status: string;
  duration: number;
  speed: string | null;
  errorMessage: string | null;
  errorStack: string | null;
  code: string | null;
  squad: string | null;
  executionType: string | null;
  product: string | null;
  module: string | null;
  functionality: string | null;
}

function processSuites(
  suites: Suite[],
  file: string,
  fileTags: Tags,
  suitePath: string[] = []
): ProcessedTest[] {
  const tests: ProcessedTest[] = [];

  for (const suite of suites) {
    const currentPath = suite.title ? [...suitePath, suite.title] : suitePath;

    // Process tests in this suite
    for (const test of suite.tests || []) {
      let status = 'pending';
      if (test.pass) status = 'passed';
      else if (test.fail) status = 'failed';
      else if (test.skipped) status = 'skipped';
      else if (test.pending) status = 'pending';

      tests.push({
        testId: `${file}::${test.fullTitle}`,
        uuid: test.uuid,
        title: test.title,
        fullTitle: test.fullTitle,
        suitePath: currentPath.join(' > '),
        file,
        status,
        duration: test.duration || 0,
        speed: test.speed || null,
        errorMessage: test.err?.message || null,
        errorStack: test.err?.estack || test.err?.stack || null,
        code: test.code || null,
        squad: fileTags.squad || null,
        executionType: fileTags.executionType || null,
        product: fileTags.product || null,
        module: fileTags.module || null,
        functionality: fileTags.functionality || null,
      });
    }

    // Recursively process nested suites
    if (suite.suites && suite.suites.length > 0) {
      tests.push(...processSuites(suite.suites, file, fileTags, currentPath));
    }
  }

  return tests;
}

async function importCypressResults() {
  console.log('=== Cypress Results Import ===\n');

  // Resolve the report path
  const absoluteReportPath = path.resolve(process.cwd(), REPORT_PATH);
  console.log(`Report path: ${absoluteReportPath}`);
  console.log(`Cypress root: ${CYPRESS_ROOT}\n`);

  if (!fs.existsSync(absoluteReportPath)) {
    console.error(`ERROR: Report file not found: ${absoluteReportPath}`);
    process.exit(1);
  }

  // Read the report
  const reportContent = fs.readFileSync(absoluteReportPath, 'utf-8');
  const report: MochawesomeResult = JSON.parse(reportContent);

  console.log(`Stats from report:`);
  console.log(`  - Tests: ${report.stats.tests}`);
  console.log(`  - Passes: ${report.stats.passes}`);
  console.log(`  - Failures: ${report.stats.failures}`);
  console.log(`  - Pending: ${report.stats.pending}`);
  console.log(`  - Skipped: ${report.stats.skipped}`);
  console.log(`  - Duration: ${report.stats.duration}ms\n`);

  // Process all tests
  const allTests: ProcessedTest[] = [];
  const fileTagsMap: Record<string, Tags> = {};

  console.log('Processing test files...\n');

  for (const result of report.results) {
    const file = result.file || result.fullFile;

    if (!file) continue;

    // Extract tags from the file
    if (!fileTagsMap[file]) {
      console.log(`Extracting tags from: ${file}`);
      fileTagsMap[file] = extractTagsFromFile(file);
    }

    const fileTags = fileTagsMap[file];
    const tests = processSuites(result.suites, file, fileTags);
    allTests.push(...tests);
  }

  console.log(`\nTotal tests processed: ${allTests.length}`);

  // Determine common tags (most frequent)
  const tagCounts: Record<string, Record<string, number>> = {
    squad: {},
    executionType: {},
    product: {},
    module: {},
    functionality: {},
  };

  allTests.forEach((test) => {
    if (test.squad) tagCounts.squad[test.squad] = (tagCounts.squad[test.squad] || 0) + 1;
    if (test.executionType) tagCounts.executionType[test.executionType] = (tagCounts.executionType[test.executionType] || 0) + 1;
    if (test.product) tagCounts.product[test.product] = (tagCounts.product[test.product] || 0) + 1;
    if (test.module) tagCounts.module[test.module] = (tagCounts.module[test.module] || 0) + 1;
    if (test.functionality) tagCounts.functionality[test.functionality] = (tagCounts.functionality[test.functionality] || 0) + 1;
  });

  const getMostCommon = (counts: Record<string, number>): string | null => {
    const entries = Object.entries(counts);
    if (entries.length === 0) return null;
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  };

  const commonTags = {
    squad: getMostCommon(tagCounts.squad),
    executionType: getMostCommon(tagCounts.executionType),
    product: getMostCommon(tagCounts.product),
    module: getMostCommon(tagCounts.module),
    functionality: getMostCommon(tagCounts.functionality),
  };

  console.log('\nMost common tags:', commonTags);

  // Initialize database
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'cypress-reports.db');
  console.log(`\nDatabase path: ${dbPath}`);

  const db = new Database(dbPath);

  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS executions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      date_key TEXT NOT NULL,
      created_at TEXT NOT NULL,
      total_tests INTEGER NOT NULL DEFAULT 0,
      passed INTEGER NOT NULL DEFAULT 0,
      failed INTEGER NOT NULL DEFAULT 0,
      skipped INTEGER NOT NULL DEFAULT 0,
      pending INTEGER NOT NULL DEFAULT 0,
      pass_rate REAL NOT NULL DEFAULT 0,
      duration INTEGER NOT NULL DEFAULT 0,
      squad TEXT,
      execution_type TEXT,
      product TEXT,
      module TEXT,
      functionality TEXT
    );

    CREATE TABLE IF NOT EXISTS tests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      execution_id INTEGER NOT NULL,
      test_id TEXT NOT NULL,
      uuid TEXT,
      title TEXT NOT NULL,
      full_title TEXT,
      suite_path TEXT,
      file TEXT,
      status TEXT NOT NULL,
      duration INTEGER NOT NULL DEFAULT 0,
      speed TEXT,
      error_message TEXT,
      error_stack TEXT,
      code TEXT,
      squad TEXT,
      execution_type TEXT,
      product TEXT,
      module TEXT,
      functionality TEXT,
      FOREIGN KEY (execution_id) REFERENCES executions(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_executions_date_key ON executions(date_key);
    CREATE INDEX IF NOT EXISTS idx_tests_execution_id ON tests(execution_id);
    CREATE INDEX IF NOT EXISTS idx_tests_status ON tests(status);
  `);

  // Calculate stats
  const passRate = report.stats.tests > 0
    ? (report.stats.passes / report.stats.tests) * 100
    : 0;

  // Format date
  const startDate = new Date(report.stats.start);
  const dateKey = startDate.toISOString().split('T')[0];
  const displayDate = `${startDate.getDate().toString().padStart(2, '0')}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getFullYear()} ${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;

  // Insert execution
  const insertExecution = db.prepare(`
    INSERT INTO executions (date, date_key, created_at, total_tests, passed, failed, skipped, pending, pass_rate, duration, squad, execution_type, product, module, functionality)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insertExecution.run(
    displayDate,
    dateKey,
    new Date().toISOString(),
    report.stats.tests,
    report.stats.passes,
    report.stats.failures,
    report.stats.skipped,
    report.stats.pending,
    passRate,
    report.stats.duration,
    commonTags.squad,
    commonTags.executionType,
    commonTags.product,
    commonTags.module,
    commonTags.functionality
  );

  const executionId = result.lastInsertRowid;
  console.log(`\nCreated execution with ID: ${executionId}`);

  // Insert tests
  const insertTest = db.prepare(`
    INSERT INTO tests (execution_id, test_id, uuid, title, full_title, suite_path, file, status, duration, speed, error_message, error_stack, code, squad, execution_type, product, module, functionality)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let insertedCount = 0;
  for (const test of allTests) {
    insertTest.run(
      executionId,
      test.testId,
      test.uuid,
      test.title,
      test.fullTitle,
      test.suitePath,
      test.file,
      test.status,
      test.duration,
      test.speed,
      test.errorMessage,
      test.errorStack,
      test.code,
      test.squad,
      test.executionType,
      test.product,
      test.module,
      test.functionality
    );
    insertedCount++;
  }

  console.log(`Inserted ${insertedCount} tests`);

  db.close();

  console.log('\n=== Import Complete ===');
  console.log(`Execution ID: ${executionId}`);
  console.log(`Tests imported: ${insertedCount}`);
  console.log(`Pass rate: ${passRate.toFixed(1)}%`);
}

importCypressResults().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});
