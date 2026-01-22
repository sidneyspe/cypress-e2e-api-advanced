import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import type { ExecutionDetail, TestResult } from '@/types';

// GET /api/executions/[id] - Get execution details with tests
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Get execution
    const execution = await db
      .select()
      .from(schema.executions)
      .where(eq(schema.executions.id, id))
      .limit(1);

    if (!execution.length) {
      return NextResponse.json(
        { success: false, error: 'Execution not found' },
        { status: 404 }
      );
    }

    const exec = execution[0];

    // Get tests for this execution
    const testsResult = await db
      .select()
      .from(schema.tests)
      .where(eq(schema.tests.executionId, id));

    const tests: TestResult[] = testsResult.map((test) => ({
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

    const executionDetail: ExecutionDetail = {
      id: exec.id,
      date: exec.date,
      dateKey: exec.dateKey,
      totalTests: exec.totalTests,
      passed: exec.passed,
      failed: exec.failed,
      skipped: exec.skipped,
      pending: exec.pending,
      passRate: exec.passRate,
      duration: exec.duration,
      squad: exec.squad || undefined,
      executionType: exec.executionType || undefined,
      product: exec.product || undefined,
      module: exec.module || undefined,
      functionality: exec.functionality || undefined,
      tests,
    };

    return NextResponse.json({ success: true, data: executionDetail });
  } catch (error) {
    console.error('Error fetching execution:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch execution' },
      { status: 500 }
    );
  }
}

// DELETE /api/executions/[id] - Delete an execution
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Delete tests first (cascade should handle this, but being explicit)
    await db.delete(schema.tests).where(eq(schema.tests.executionId, id));

    // Delete execution
    await db.delete(schema.executions).where(eq(schema.executions.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting execution:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete execution' },
      { status: 500 }
    );
  }
}
