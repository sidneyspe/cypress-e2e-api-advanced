import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Executions table - stores each test run
export const executions = sqliteTable('executions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(), // Format: DD/MM/YYYY
  dateKey: text('date_key').notNull(), // Format: YYYY-MM-DD for sorting
  createdAt: text('created_at').notNull(),

  // Summary metrics
  totalTests: integer('total_tests').notNull().default(0),
  passed: integer('passed').notNull().default(0),
  failed: integer('failed').notNull().default(0),
  skipped: integer('skipped').notNull().default(0),
  pending: integer('pending').notNull().default(0),
  passRate: real('pass_rate').notNull().default(0),
  duration: integer('duration').notNull().default(0), // in milliseconds

  // Tags/metadata
  squad: text('squad'),
  executionType: text('execution_type'),
  product: text('product'),
  module: text('module'),
  functionality: text('functionality'),
});

// Tests table - stores individual test results
export const tests = sqliteTable('tests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  executionId: integer('execution_id').notNull().references(() => executions.id, { onDelete: 'cascade' }),

  // Test identification
  testId: text('test_id').notNull(), // Original test ID like 'test-0'
  uuid: text('uuid'),
  title: text('title').notNull(),
  fullTitle: text('full_title'),
  suitePath: text('suite_path'), // JSON array as string
  file: text('file'),

  // Test result
  status: text('status').notNull(), // 'passed', 'failed', 'pending', 'skipped'
  duration: integer('duration').notNull().default(0),
  speed: text('speed'), // 'fast', 'medium', 'slow'

  // Error info (for failed tests)
  errorMessage: text('error_message'),
  errorStack: text('error_stack'),

  // Test code
  code: text('code'),

  // Tags inherited from describe block
  squad: text('squad'),
  executionType: text('execution_type'),
  product: text('product'),
  module: text('module'),
  functionality: text('functionality'),
});

// Tags table - stores distinct tag values for filters
export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull(), // 'squad', 'executionType', 'product', 'module', 'functionality'
  value: text('value').notNull(),
});

// Type exports
export type Execution = typeof executions.$inferSelect;
export type NewExecution = typeof executions.$inferInsert;
export type Test = typeof tests.$inferSelect;
export type NewTest = typeof tests.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
