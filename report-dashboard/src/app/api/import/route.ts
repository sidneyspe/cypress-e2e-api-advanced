import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/db';
import type { CypressResult, CypressSuite, CypressTest } from '@/types';
import { toDateKey, toDisplayDate } from '@/lib/utils';
import fs from 'fs';
import path from 'path';

interface TestWithTags {
  testId: string;
  uuid: string;
  title: string;
  fullTitle: string;
  suitePath: string[];
  file: string;
  status: 'passed' | 'failed' | 'pending' | 'skipped';
  duration: number;
  speed: string;
  code: string;
  errorMessage?: string;
  errorStack?: string;
  tags: {
    squad?: string;
    executionType?: string;
    product?: string;
    module?: string;
    functionality?: string;
  };
}

// Extract tags from test file
function extractTagsFromFile(filePath: string): Record<string, string> | null {
  try {
    // Convert Windows path separators and make path relative
    const normalizedPath = filePath.replace(/\\/g, '/');

    // Try to find the file in the cypress directory
    const possiblePaths = [
      path.join(process.cwd(), '..', normalizedPath),
      path.join(process.cwd(), '..', 'cypress', 'e2e', path.basename(path.dirname(normalizedPath)), path.basename(normalizedPath)),
    ];

    let content = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        content = fs.readFileSync(p, 'utf8');
        break;
      }
    }

    if (!content) return null;

    // Match tags object in describe block
    const tagsMatch = content.match(/tags:\s*\{([^}]+)\}/s);
    if (!tagsMatch) return null;

    const tagsContent = tagsMatch[1];
    const tags: Record<string, string> = {};

    const tagPatterns = [
      { key: 'squad', regex: /squad:\s*['"]([^'"]+)['"]/ },
      { key: 'executionType', regex: /executionType:\s*['"]([^'"]+)['"]/ },
      { key: 'product', regex: /product:\s*['"]([^'"]+)['"]/ },
      { key: 'module', regex: /module:\s*['"]([^'"]+)['"]/ },
      { key: 'functionality', regex: /functionality:\s*['"]([^'"]+)['"]/ },
    ];

    tagPatterns.forEach(({ key, regex }) => {
      const match = tagsContent.match(regex);
      if (match) {
        tags[key] = match[1];
      }
    });

    return Object.keys(tags).length > 0 ? tags : null;
  } catch (error) {
    console.error(`Error extracting tags from ${filePath}:`, error);
    return null;
  }
}

// Process suites recursively
function processSuites(
  suites: CypressSuite[],
  parentPath: string[] = [],
  parentFile: string = '',
  fileTagsMap: Map<string, Record<string, string>>
): TestWithTags[] {
  const tests: TestWithTags[] = [];
  let testIndex = 0;

  const processSuite = (suite: CypressSuite, suitePath: string[], file: string) => {
    const currentPath = suite.title ? [...suitePath, suite.title] : suitePath;
    const currentFile = suite.file || file;

    // Get tags for this file
    let tags = fileTagsMap.get(currentFile.toLowerCase());
    if (!tags) {
      const extracted = extractTagsFromFile(currentFile);
      if (extracted) {
        fileTagsMap.set(currentFile.toLowerCase(), extracted);
        tags = extracted;
      }
    }

    // Process tests in this suite
    (suite.tests || []).forEach((test: CypressTest) => {
      const status = test.pass
        ? 'passed'
        : test.fail
        ? 'failed'
        : test.pending
        ? 'pending'
        : 'skipped';

      tests.push({
        testId: `test-${testIndex++}`,
        uuid: test.uuid,
        title: test.title,
        fullTitle: test.fullTitle || [...currentPath, test.title].join(' > '),
        suitePath: currentPath,
        file: currentFile,
        status,
        duration: test.duration || 0,
        speed: test.speed || 'fast',
        code: test.code || '',
        errorMessage: test.err?.message,
        errorStack: test.err?.estack || test.err?.stack,
        tags: tags || {},
      });
    });

    // Process nested suites
    (suite.suites || []).forEach((nestedSuite) => {
      const nestedTests = processSuite(nestedSuite, currentPath, currentFile);
      tests.push(...nestedTests);
    });

    return tests;
  };

  suites.forEach((suite) => processSuite(suite, parentPath, parentFile));
  return tests;
}

// POST /api/import - Import Cypress results
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, tags: executionTags } = body as {
      data: CypressResult;
      tags?: {
        squad?: string;
        executionType?: string;
        product?: string;
        module?: string;
        functionality?: string;
      }
    };

    if (!data || !data.stats || !data.results) {
      return NextResponse.json(
        { success: false, error: 'Invalid Cypress result format' },
        { status: 400 }
      );
    }

    const stats = data.stats;
    const now = new Date();
    const dateKey = toDateKey(now);
    const date = toDisplayDate(dateKey);

    // Extract all tests with their tags
    const fileTagsMap = new Map<string, Record<string, string>>();
    const allTests: TestWithTags[] = [];

    data.results.forEach((result) => {
      const file = result.file || result.fullFile || '';
      if (result.suites && result.suites.length > 0) {
        const tests = processSuites(result.suites, [], file, fileTagsMap);
        allTests.push(...tests);
      }
    });

    // Calculate metrics
    const passed = allTests.filter((t) => t.status === 'passed').length;
    const failed = allTests.filter((t) => t.status === 'failed').length;
    const pending = allTests.filter((t) => t.status === 'pending').length;
    const skipped = allTests.filter((t) => t.status === 'skipped').length;
    const totalTests = allTests.length;
    const passRate = totalTests > 0 ? (passed / totalTests) * 100 : 0;

    // Insert execution
    const executionResult = await db
      .insert(schema.executions)
      .values({
        date,
        dateKey,
        createdAt: now.toISOString(),
        totalTests,
        passed,
        failed,
        skipped,
        pending,
        passRate,
        duration: stats.duration || 0,
        squad: executionTags?.squad,
        executionType: executionTags?.executionType,
        product: executionTags?.product,
        module: executionTags?.module,
        functionality: executionTags?.functionality,
      })
      .returning();

    const executionId = executionResult[0].id;

    // Insert tests
    if (allTests.length > 0) {
      await db.insert(schema.tests).values(
        allTests.map((test) => ({
          executionId,
          testId: test.testId,
          uuid: test.uuid,
          title: test.title,
          fullTitle: test.fullTitle,
          suitePath: JSON.stringify(test.suitePath),
          file: test.file,
          status: test.status,
          duration: test.duration,
          speed: test.speed,
          errorMessage: test.errorMessage,
          errorStack: test.errorStack,
          code: test.code,
          squad: test.tags.squad,
          executionType: test.tags.executionType,
          product: test.tags.product,
          module: test.tags.module,
          functionality: test.tags.functionality,
        }))
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        executionId,
        totalTests,
        passed,
        failed,
        pending,
        skipped,
        passRate: passRate.toFixed(1),
      },
    });
  } catch (error) {
    console.error('Error importing Cypress results:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to import results' },
      { status: 500 }
    );
  }
}
