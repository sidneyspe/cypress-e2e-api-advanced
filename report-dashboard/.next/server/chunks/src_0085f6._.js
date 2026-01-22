module.exports = {

"[project]/report-dashboard/src/db/schema.ts [app-route] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "executions": ()=>executions,
    "tags": ()=>tags,
    "tests": ()=>tests
});
var __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/report-dashboard/node_modules/drizzle-orm/sqlite-core/table.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/report-dashboard/node_modules/drizzle-orm/sqlite-core/columns/text.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/report-dashboard/node_modules/drizzle-orm/sqlite-core/columns/integer.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/report-dashboard/node_modules/drizzle-orm/sqlite-core/columns/real.js [app-route] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
const executions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sqliteTable"])('executions', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('id').primaryKey({
        autoIncrement: true
    }),
    date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('date').notNull(),
    dateKey: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('date_key').notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('created_at').notNull(),
    // Summary metrics
    totalTests: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('total_tests').notNull().default(0),
    passed: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('passed').notNull().default(0),
    failed: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('failed').notNull().default(0),
    skipped: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('skipped').notNull().default(0),
    pending: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('pending').notNull().default(0),
    passRate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["real"])('pass_rate').notNull().default(0),
    duration: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('duration').notNull().default(0),
    // Tags/metadata
    squad: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('squad'),
    executionType: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('execution_type'),
    product: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('product'),
    module: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('module'),
    functionality: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('functionality')
});
const tests = (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sqliteTable"])('tests', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('id').primaryKey({
        autoIncrement: true
    }),
    executionId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('execution_id').notNull().references(()=>executions.id, {
        onDelete: 'cascade'
    }),
    // Test identification
    testId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('test_id').notNull(),
    uuid: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('uuid'),
    title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('title').notNull(),
    fullTitle: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('full_title'),
    suitePath: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('suite_path'),
    file: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('file'),
    // Test result
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('status').notNull(),
    duration: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('duration').notNull().default(0),
    speed: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('speed'),
    // Error info (for failed tests)
    errorMessage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('error_message'),
    errorStack: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('error_stack'),
    // Test code
    code: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('code'),
    // Tags inherited from describe block
    squad: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('squad'),
    executionType: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('execution_type'),
    product: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('product'),
    module: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('module'),
    functionality: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('functionality')
});
const tags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sqliteTable"])('tags', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('id').primaryKey({
        autoIncrement: true
    }),
    type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('type').notNull(),
    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('value').notNull()
});

})()),
"[project]/report-dashboard/src/db/index.ts [app-route] (ecmascript) <locals>": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "db": ()=>db,
    "initializeDatabase": ()=>initializeDatabase
});
var __TURBOPACK__commonjs__external__path__ = __turbopack_external_require__("path", true);
var __TURBOPACK__commonjs__external__fs__ = __turbopack_external_require__("fs", true);
var __TURBOPACK__commonjs__external__better$2d$sqlite3__ = __turbopack_external_require__("better-sqlite3", true);
var __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$better$2d$sqlite3$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/report-dashboard/node_modules/drizzle-orm/better-sqlite3/driver.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/report-dashboard/src/db/schema.ts [app-route] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
;
;
// Ensure data directory exists
const dataDir = __TURBOPACK__commonjs__external__path__["default"].join(process.cwd(), 'data');
if (!__TURBOPACK__commonjs__external__fs__["default"].existsSync(dataDir)) {
    __TURBOPACK__commonjs__external__fs__["default"].mkdirSync(dataDir, {
        recursive: true
    });
}
const dbPath = __TURBOPACK__commonjs__external__path__["default"].join(dataDir, 'cypress-reports.db');
const sqlite = new __TURBOPACK__commonjs__external__better$2d$sqlite3__["default"](dbPath);
// Enable foreign keys
sqlite.pragma('foreign_keys = ON');
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$better$2d$sqlite3$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["drizzle"])(sqlite, {
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
});
function initializeDatabase() {
    sqlite.exec(`
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

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      value TEXT NOT NULL,
      UNIQUE(type, value)
    );

    CREATE INDEX IF NOT EXISTS idx_executions_date_key ON executions(date_key);
    CREATE INDEX IF NOT EXISTS idx_tests_execution_id ON tests(execution_id);
    CREATE INDEX IF NOT EXISTS idx_tests_status ON tests(status);
    CREATE INDEX IF NOT EXISTS idx_tags_type ON tags(type);
  `);
}
// Initialize on import
initializeDatabase();
;

})()),
"[project]/report-dashboard/src/db/index.ts [app-route] (ecmascript) <module evaluation>": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({});
var __TURBOPACK__commonjs__external__better$2d$sqlite3__ = __turbopack_external_require__("better-sqlite3", true);
var __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/report-dashboard/src/db/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__commonjs__external__path__ = __turbopack_external_require__("path", true);
var __TURBOPACK__commonjs__external__fs__ = __turbopack_external_require__("fs", true);
var __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/report-dashboard/src/db/index.ts [app-route] (ecmascript) <locals>");
"__TURBOPACK__ecmascript__hoisting__location__";

})()),
"[project]/report-dashboard/src/db/schema.ts [app-route] (ecmascript) <export * as schema>": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "schema": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/report-dashboard/src/db/schema.ts [app-route] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";

})()),
"[project]/report-dashboard/src/app/api/tags/route.ts [app-route] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "GET": ()=>GET
});
var __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/report-dashboard/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_import__("[project]/report-dashboard/src/db/index.ts [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/report-dashboard/src/db/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__ = __turbopack_import__("[project]/report-dashboard/src/db/schema.ts [app-route] (ecmascript) <export * as schema>");
var __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/report-dashboard/node_modules/drizzle-orm/sql/sql.js [app-route] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
async function GET() {
    try {
        // Get distinct values from executions table for each tag type
        const squadResult = await __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].selectDistinct({
            value: __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].executions.squad
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].executions).where(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].executions.squad} IS NOT NULL`);
        const executionTypeResult = await __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].selectDistinct({
            value: __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].executions.executionType
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].executions).where(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].executions.executionType} IS NOT NULL`);
        const productResult = await __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].selectDistinct({
            value: __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].executions.product
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].executions).where(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].executions.product} IS NOT NULL`);
        const moduleResult = await __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].selectDistinct({
            value: __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].executions.module
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].executions).where(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].executions.module} IS NOT NULL`);
        const functionalityResult = await __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].selectDistinct({
            value: __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].executions.functionality
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].executions).where(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].executions.functionality} IS NOT NULL`);
        // Also get from tests table for more complete coverage
        const testSquadResult = await __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].selectDistinct({
            value: __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].tests.squad
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].tests).where(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].tests.squad} IS NOT NULL`);
        const testExecutionTypeResult = await __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].selectDistinct({
            value: __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].tests.executionType
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].tests).where(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].tests.executionType} IS NOT NULL`);
        const testProductResult = await __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].selectDistinct({
            value: __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].tests.product
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].tests).where(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].tests.product} IS NOT NULL`);
        const testModuleResult = await __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].selectDistinct({
            value: __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].tests.module
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].tests).where(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].tests.module} IS NOT NULL`);
        const testFunctionalityResult = await __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].selectDistinct({
            value: __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].tests.functionality
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].tests).where(__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__schema$3e$__["schema"].tests.functionality} IS NOT NULL`);
        // Combine and dedupe
        const combine = (arr1, arr2)=>{
            const set = new Set();
            [
                ...arr1,
                ...arr2
            ].forEach((item)=>{
                if (item.value) set.add(item.value);
            });
            return Array.from(set).sort();
        };
        const tagOptions = {
            squads: combine(squadResult, testSquadResult),
            executionTypes: combine(executionTypeResult, testExecutionTypeResult),
            products: combine(productResult, testProductResult),
            modules: combine(moduleResult, testModuleResult),
            functionalities: combine(functionalityResult, testFunctionalityResult)
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: tagOptions
        });
    } catch (error) {
        console.error('Error fetching tags:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$report$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch tags'
        }, {
            status: 500
        });
    }
}

})()),

};

//# sourceMappingURL=src_0085f6._.js.map