import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/db';
import { eq, sql } from 'drizzle-orm';
import type { TagOptions } from '@/types';

// GET /api/tags - Get all distinct tag values
export async function GET() {
  try {
    // Get distinct values from executions table for each tag type
    const squadResult = await db
      .selectDistinct({ value: schema.executions.squad })
      .from(schema.executions)
      .where(sql`${schema.executions.squad} IS NOT NULL`);

    const executionTypeResult = await db
      .selectDistinct({ value: schema.executions.executionType })
      .from(schema.executions)
      .where(sql`${schema.executions.executionType} IS NOT NULL`);

    const productResult = await db
      .selectDistinct({ value: schema.executions.product })
      .from(schema.executions)
      .where(sql`${schema.executions.product} IS NOT NULL`);

    const moduleResult = await db
      .selectDistinct({ value: schema.executions.module })
      .from(schema.executions)
      .where(sql`${schema.executions.module} IS NOT NULL`);

    const functionalityResult = await db
      .selectDistinct({ value: schema.executions.functionality })
      .from(schema.executions)
      .where(sql`${schema.executions.functionality} IS NOT NULL`);

    // Also get from tests table for more complete coverage
    const testSquadResult = await db
      .selectDistinct({ value: schema.tests.squad })
      .from(schema.tests)
      .where(sql`${schema.tests.squad} IS NOT NULL`);

    const testExecutionTypeResult = await db
      .selectDistinct({ value: schema.tests.executionType })
      .from(schema.tests)
      .where(sql`${schema.tests.executionType} IS NOT NULL`);

    const testProductResult = await db
      .selectDistinct({ value: schema.tests.product })
      .from(schema.tests)
      .where(sql`${schema.tests.product} IS NOT NULL`);

    const testModuleResult = await db
      .selectDistinct({ value: schema.tests.module })
      .from(schema.tests)
      .where(sql`${schema.tests.module} IS NOT NULL`);

    const testFunctionalityResult = await db
      .selectDistinct({ value: schema.tests.functionality })
      .from(schema.tests)
      .where(sql`${schema.tests.functionality} IS NOT NULL`);

    // Combine and dedupe
    const combine = (arr1: { value: string | null }[], arr2: { value: string | null }[]) => {
      const set = new Set<string>();
      [...arr1, ...arr2].forEach((item) => {
        if (item.value) set.add(item.value);
      });
      return Array.from(set).sort();
    };

    const tagOptions: TagOptions = {
      squads: combine(squadResult, testSquadResult),
      executionTypes: combine(executionTypeResult, testExecutionTypeResult),
      products: combine(productResult, testProductResult),
      modules: combine(moduleResult, testModuleResult),
      functionalities: combine(functionalityResult, testFunctionalityResult),
    };

    return NextResponse.json({ success: true, data: tagOptions });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}
