// Execution types
export interface ExecutionSummary {
  id: number;
  date: string;
  dateKey: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  pending: number;
  passRate: number;
  duration: number;
  squad?: string;
  executionType?: string;
  product?: string;
  module?: string;
  functionality?: string;
}

export interface ExecutionDetail extends ExecutionSummary {
  tests: TestResult[];
}

// Test types
export interface TestResult {
  id: number;
  testId: string;
  uuid?: string;
  title: string;
  fullTitle?: string;
  suitePath?: string;
  file?: string;
  status: 'passed' | 'failed' | 'pending' | 'skipped';
  duration: number;
  speed?: string;
  errorMessage?: string;
  errorStack?: string;
  code?: string;
  squad?: string;
  executionType?: string;
  product?: string;
  module?: string;
  functionality?: string;
}

// Filter types
export interface FilterState {
  squad: string[];
  executionType: string[];
  product: string[];
  module: string[];
  functionality: string[];
  status: string[];
  [key: string]: string[];
}

export interface TagOptions {
  squads: string[];
  executionTypes: string[];
  products: string[];
  modules: string[];
  functionalities: string[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Dashboard metrics
export interface DashboardMetrics {
  totalExecutions: number;
  totalTests: number;
  overallPassRate: number;
  avgDuration: number;
  recentExecutions: ExecutionSummary[];
  testsByStatus: {
    passed: number;
    failed: number;
    pending: number;
    skipped: number;
  };
  testsByTag: {
    [key: string]: { [value: string]: number };
  };
}

// Cypress import types
export interface CypressResult {
  stats: {
    suites: number;
    tests: number;
    passes: number;
    pending: number;
    failures: number;
    duration: number;
    start: string;
    end: string;
  };
  results: CypressSpecResult[];
}

export interface CypressSpecResult {
  uuid: string;
  title: string;
  fullFile: string;
  file: string;
  suites: CypressSuite[];
}

export interface CypressSuite {
  uuid: string;
  title: string;
  file: string;
  tests: CypressTest[];
  suites: CypressSuite[];
}

export interface CypressTest {
  title: string;
  fullTitle: string;
  duration: number;
  state: string;
  speed: string;
  pass: boolean;
  fail: boolean;
  pending: boolean;
  code: string;
  err: {
    message?: string;
    estack?: string;
    stack?: string;
  };
  uuid: string;
}
