import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/db';
import { desc, eq, and, inArray, sql } from 'drizzle-orm';
import type { ExecutionSummary, ApiResponse, PaginatedResponse } from '@/types';

// GET /api/executions - List all executions with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const squad = searchParams.get('squad')?.split(',').filter(Boolean);
    const executionType = searchParams.get('executionType')?.split(',').filter(Boolean);
    const product = searchParams.get('product')?.split(',').filter(Boolean);
    const module = searchParams.get('module')?.split(',').filter(Boolean);
    const functionality = searchParams.get('functionality')?.split(',').filter(Boolean);

    // Build conditions
    const conditions = [];
    if (squad?.length) conditions.push(inArray(schema.executions.squad, squad));
    if (executionType?.length) conditions.push(inArray(schema.executions.executionType, executionType));
    if (product?.length) conditions.push(inArray(schema.executions.product, product));
    if (module?.length) conditions.push(inArray(schema.executions.module, module));
    if (functionality?.length) conditions.push(inArray(schema.executions.functionality, functionality));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.executions)
      .where(whereClause);
    const total = countResult[0]?.count || 0;

    // Get paginated results
    const results = await db
      .select()
      .from(schema.executions)
      .where(whereClause)
      .orderBy(desc(schema.executions.dateKey), desc(schema.executions.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const executions: ExecutionSummary[] = results.map((row) => ({
      id: row.id,
      date: row.date,
      dateKey: row.dateKey,
      totalTests: row.totalTests,
      passed: row.passed,
      failed: row.failed,
      skipped: row.skipped,
      pending: row.pending,
      passRate: row.passRate,
      duration: row.duration,
      squad: row.squad || undefined,
      executionType: row.executionType || undefined,
      product: row.product || undefined,
      module: row.module || undefined,
      functionality: row.functionality || undefined,
    }));

    const response: PaginatedResponse<ExecutionSummary> = {
      items: executions,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching executions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch executions' },
      { status: 500 }
    );
  }
}

// POST /api/executions - Create a new execution
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await db.insert(schema.executions).values({
      date: body.date,
      dateKey: body.dateKey,
      createdAt: new Date().toISOString(),
      totalTests: body.totalTests || 0,
      passed: body.passed || 0,
      failed: body.failed || 0,
      skipped: body.skipped || 0,
      pending: body.pending || 0,
      passRate: body.passRate || 0,
      duration: body.duration || 0,
      squad: body.tags?.squad,
      executionType: body.tags?.executionType,
      product: body.tags?.product,
      module: body.tags?.module,
      functionality: body.tags?.functionality,
    }).returning();

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error creating execution:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create execution' },
      { status: 500 }
    );
  }
}
