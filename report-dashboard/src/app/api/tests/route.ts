import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/db';
import { desc, eq, and, inArray, sql } from 'drizzle-orm';
import type { TestResult, PaginatedResponse } from '@/types';

// GET /api/tests - List tests with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    const executionId = searchParams.get('executionId');
    const status = searchParams.get('status')?.split(',').filter(Boolean);
    const squad = searchParams.get('squad')?.split(',').filter(Boolean);
    const executionType = searchParams.get('executionType')?.split(',').filter(Boolean);
    const product = searchParams.get('product')?.split(',').filter(Boolean);
    const module = searchParams.get('module')?.split(',').filter(Boolean);
    const functionality = searchParams.get('functionality')?.split(',').filter(Boolean);

    // Build conditions
    const conditions = [];
    if (executionId) conditions.push(eq(schema.tests.executionId, parseInt(executionId)));
    if (status?.length) conditions.push(inArray(schema.tests.status, status));
    if (squad?.length) conditions.push(inArray(schema.tests.squad, squad));
    if (executionType?.length) conditions.push(inArray(schema.tests.executionType, executionType));
    if (product?.length) conditions.push(inArray(schema.tests.product, product));
    if (module?.length) conditions.push(inArray(schema.tests.module, module));
    if (functionality?.length) conditions.push(inArray(schema.tests.functionality, functionality));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.tests)
      .where(whereClause);
    const total = countResult[0]?.count || 0;

    // Get paginated results
    const results = await db
      .select()
      .from(schema.tests)
      .where(whereClause)
      .orderBy(desc(schema.tests.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const tests: TestResult[] = results.map((test) => ({
      id: test.id,
      testId: test.testId,
      uuid: test.uuid || undefined,
      title: test.title,
      fullTitle: test.fullTitle || undefined,
      suitePath: test.suitePath || undefined,
      file: test.file || undefined,
      status: test.status as 'passed' | 'failed' | 'pending' | 'skipped',
      duration: test.duration,
      speed: test.speed || undefined,
      errorMessage: test.errorMessage || undefined,
      errorStack: test.errorStack || undefined,
      code: test.code || undefined,
      squad: test.squad || undefined,
      executionType: test.executionType || undefined,
      product: test.product || undefined,
      module: test.module || undefined,
      functionality: test.functionality || undefined,
    }));

    const response: PaginatedResponse<TestResult> = {
      items: tests,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
}
