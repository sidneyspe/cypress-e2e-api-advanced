-- Tabela de execucoes (runs)
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
  tags TEXT,
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
  tag_squad TEXT,
  tag_execution_type TEXT,
  tag_product TEXT,
  tag_module TEXT,
  tag_functionality TEXT,
  tags_json TEXT,
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
  is_failure_screenshot BOOLEAN DEFAULT FALSE,
  screenshot_at_command TEXT,
  screenshot_timestamp DATETIME,
  error_hash TEXT,
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
  error_pattern TEXT,
  first_seen_at DATETIME NOT NULL,
  last_seen_at DATETIME NOT NULL,
  occurrence_count INTEGER DEFAULT 1,
  status TEXT CHECK(status IN ('new', 'investigating', 'known', 'fixed', 'wont_fix')) DEFAULT 'new',
  jira_ticket TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indices para performance
CREATE INDEX IF NOT EXISTS idx_test_runs_status ON test_runs(status);
CREATE INDEX IF NOT EXISTS idx_test_runs_started_at ON test_runs(started_at);
CREATE INDEX IF NOT EXISTS idx_test_specs_run_id ON test_specs(run_id);
CREATE INDEX IF NOT EXISTS idx_test_cases_run_id ON test_cases(run_id);
CREATE INDEX IF NOT EXISTS idx_test_cases_status ON test_cases(status);
CREATE INDEX IF NOT EXISTS idx_test_artifacts_run_id ON test_artifacts(run_id);
CREATE INDEX IF NOT EXISTS idx_test_artifacts_error_hash ON test_artifacts(error_hash);
CREATE INDEX IF NOT EXISTS idx_cataloged_bugs_error_hash ON cataloged_bugs(error_hash);

-- Views uteis
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
