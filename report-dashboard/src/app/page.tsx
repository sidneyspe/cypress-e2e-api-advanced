'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FilterBar } from '@/components/filters';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { MetricsSection } from '@/components/dashboard/MetricsSection';
import { useFilterStore } from '@/store/filters';
import type { ExecutionSummary, TestResult, PaginatedResponse } from '@/types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

async function fetchExecutions(
  filters: Record<string, string[]>
): Promise<PaginatedResponse<ExecutionSummary>> {
  const params = new URLSearchParams();
  params.set('pageSize', '50');

  Object.entries(filters).forEach(([key, values]) => {
    if (values.length > 0) {
      params.set(key, values.join(','));
    }
  });

  const response = await fetch(`/api/executions?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch executions');
  }
  const json: ApiResponse<PaginatedResponse<ExecutionSummary>> =
    await response.json();
  return json.data;
}

async function fetchLatestTests(
  filters: Record<string, string[]>
): Promise<PaginatedResponse<TestResult>> {
  const params = new URLSearchParams();
  params.set('pageSize', '100');

  Object.entries(filters).forEach(([key, values]) => {
    if (values.length > 0) {
      params.set(key, values.join(','));
    }
  });

  const response = await fetch(`/api/tests?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch tests');
  }
  const json: ApiResponse<PaginatedResponse<TestResult>> =
    await response.json();
  return json.data;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

export default function Dashboard() {
  const { filters } = useFilterStore();

  const { data: executionsData, isLoading: loadingExecutions } = useQuery({
    queryKey: ['executions', filters],
    queryFn: () => fetchExecutions(filters),
  });

  const { data: testsData, isLoading: loadingTests } = useQuery({
    queryKey: ['tests', filters],
    queryFn: () => fetchLatestTests(filters),
  });

  const executions = executionsData?.items || [];
  const tests = testsData?.items || [];

  // Calculate aggregated stats from all executions
  const aggregatedStats = executions.reduce(
    (acc, exec) => ({
      totalTests: acc.totalTests + exec.totalTests,
      passed: acc.passed + exec.passed,
      failed: acc.failed + exec.failed,
      skipped: acc.skipped + exec.skipped,
      pending: acc.pending + exec.pending,
      duration: acc.duration + exec.duration,
    }),
    { totalTests: 0, passed: 0, failed: 0, skipped: 0, pending: 0, duration: 0 }
  );

  const passRate =
    aggregatedStats.totalTests > 0
      ? (aggregatedStats.passed / aggregatedStats.totalTests) * 100
      : 0;

  const failRate =
    aggregatedStats.totalTests > 0
      ? (aggregatedStats.failed / aggregatedStats.totalTests) * 100
      : 0;

  const pendingRate =
    aggregatedStats.totalTests > 0
      ? (aggregatedStats.pending / aggregatedStats.totalTests) * 100
      : 0;

  // Calculate test distribution
  const testDistribution = tests.reduce(
    (acc, test) => {
      const file = (test.file || '').toLowerCase();
      if (file.includes('mock')) {
        acc.mock++;
      } else if (file.includes('api')) {
        acc.integration++;
      } else {
        acc.e2e++;
      }
      return acc;
    },
    { e2e: 0, mock: 0, integration: 0, unit: 0 }
  );

  // Calculate feature coverage
  const featureCoverage = tests.reduce(
    (acc, test) => {
      const suitePath = test.suitePath || '';
      const featureName = suitePath.split(' > ')[0] || 'Unknown';

      if (!acc[featureName]) {
        acc[featureName] = { passed: 0, failed: 0, pending: 0, total: 0 };
      }

      acc[featureName].total++;
      if (test.status === 'passed') acc[featureName].passed++;
      if (test.status === 'failed') acc[featureName].failed++;
      if (test.status === 'pending' || test.status === 'skipped')
        acc[featureName].pending++;

      return acc;
    },
    {} as Record<
      string,
      { passed: number; failed: number; pending: number; total: number }
    >
  );

  // Get current date/time
  const now = new Date();
  const currentDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <FilterBar />

      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Painel</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Resumo da Execucao e Analises
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <svg
                className="w-4 h-4 text-primary-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span className="font-mono">
                {formatDuration(aggregatedStats.duration)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <svg
                className="w-4 h-4 text-primary-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span>
                {currentDate} {currentTime}
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-all hover:shadow-lg">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Exportar</span>
          </button>
        </div>
      </header>

      {loadingExecutions || loadingTests ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <StatsCards
            totalTests={aggregatedStats.totalTests}
            passed={aggregatedStats.passed}
            failed={aggregatedStats.failed}
            pending={aggregatedStats.pending}
            passRate={passRate}
            failRate={failRate}
            pendingRate={pendingRate}
          />

          {/* Charts Row */}
          <ChartsSection
            passed={aggregatedStats.passed}
            failed={aggregatedStats.failed}
            pending={aggregatedStats.pending}
            testDistribution={testDistribution}
          />

          {/* Progress & Metrics Row */}
          <MetricsSection
            passRate={passRate}
            passed={aggregatedStats.passed}
            failed={aggregatedStats.failed}
            pending={aggregatedStats.pending}
            duration={aggregatedStats.duration}
            featureCount={Object.keys(featureCoverage).length}
          />
        </>
      )}
    </div>
  );
}
