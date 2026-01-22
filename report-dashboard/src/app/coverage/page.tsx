'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FilterBar } from '@/components/filters';
import { useFilterStore } from '@/store/filters';
import type { TestResult, PaginatedResponse } from '@/types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

async function fetchTests(
  filters: Record<string, string[]>
): Promise<PaginatedResponse<TestResult>> {
  const params = new URLSearchParams();
  params.set('pageSize', '200');

  Object.entries(filters).forEach(([key, values]) => {
    if (values.length > 0) {
      params.set(key, values.join(','));
    }
  });

  const response = await fetch(`/api/tests?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch tests');
  }
  const json: ApiResponse<PaginatedResponse<TestResult>> = await response.json();
  return json.data;
}

interface FeatureCoverage {
  name: string;
  passed: number;
  failed: number;
  pending: number;
  total: number;
  passRate: number;
}

export default function CoveragePage() {
  const { filters } = useFilterStore();

  const { data: testsData, isLoading } = useQuery({
    queryKey: ['tests', filters],
    queryFn: () => fetchTests(filters),
  });

  const tests = testsData?.items || [];

  // Calculate feature coverage
  const featureCoverage = useMemo(() => {
    const features: Record<
      string,
      { passed: number; failed: number; pending: number; total: number }
    > = {};

    tests.forEach((test) => {
      const suitePath = test.suitePath || '';
      const featureName = suitePath.split(' > ')[0] || 'Unknown';

      if (!features[featureName]) {
        features[featureName] = { passed: 0, failed: 0, pending: 0, total: 0 };
      }

      features[featureName].total++;
      if (test.status === 'passed') features[featureName].passed++;
      if (test.status === 'failed') features[featureName].failed++;
      if (test.status === 'pending' || test.status === 'skipped')
        features[featureName].pending++;
    });

    return Object.entries(features)
      .map(([name, data]) => ({
        name,
        ...data,
        passRate: data.total > 0 ? (data.passed / data.total) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [tests]);

  // Overall stats
  const overallStats = useMemo(() => {
    const total = tests.length;
    const passed = tests.filter((t) => t.status === 'passed').length;
    const failed = tests.filter((t) => t.status === 'failed').length;
    const pending = tests.filter(
      (t) => t.status === 'pending' || t.status === 'skipped'
    ).length;
    const passRate = total > 0 ? (passed / total) * 100 : 0;

    return { total, passed, failed, pending, passRate };
  }, [tests]);

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <FilterBar />

      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-3xl font-bold gradient-text">
            Cobertura por Funcionalidade
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {featureCoverage.length} funcionalidades testadas
          </p>
        </div>

        {/* Overall Pass Rate */}
        <div className="flex items-center gap-4 px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="text-right">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Taxa Geral
            </span>
            <p
              className={`text-2xl font-bold ${
                overallStats.passRate >= 90
                  ? 'text-success-500'
                  : overallStats.passRate >= 70
                    ? 'text-warning-500'
                    : 'text-danger-500'
              }`}
            >
              {overallStats.passRate.toFixed(1)}%
            </p>
          </div>
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              overallStats.passRate >= 90
                ? 'bg-success-500/10'
                : overallStats.passRate >= 70
                  ? 'bg-warning-500/10'
                  : 'bg-danger-500/10'
            }`}
          >
            <svg
              className={`w-7 h-7 ${
                overallStats.passRate >= 90
                  ? 'text-success-500'
                  : overallStats.passRate >= 70
                    ? 'text-warning-500'
                    : 'text-danger-500'
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 border-l-4 border-l-info-500">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Total Testes
          </span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {overallStats.total}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 border-l-4 border-l-success-500">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Passou
          </span>
          <p className="text-2xl font-bold text-success-500">
            {overallStats.passed}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 border-l-4 border-l-danger-500">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Falhou
          </span>
          <p className="text-2xl font-bold text-danger-500">
            {overallStats.failed}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 border-l-4 border-l-warning-500">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Pendente
          </span>
          <p className="text-2xl font-bold text-warning-500">
            {overallStats.pending}
          </p>
        </div>
      </div>

      {/* Coverage Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : featureCoverage.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <svg
            className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </svg>
          <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">
            Sem dados de cobertura
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
            Nenhuma funcionalidade encontrada
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCoverage.map((feature) => (
            <div
              key={feature.name}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover-lift"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                  {feature.name}
                </h4>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    feature.passRate >= 90
                      ? 'bg-success-500/10 text-success-500'
                      : feature.passRate >= 70
                        ? 'bg-warning-500/10 text-warning-500'
                        : 'bg-danger-500/10 text-danger-500'
                  }`}
                >
                  {feature.passRate.toFixed(0)}%
                </span>
              </div>

              <div className="mb-4">
                <div className="flex h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                  {feature.passed > 0 && (
                    <div
                      className="bg-success-500"
                      style={{
                        width: `${(feature.passed / feature.total) * 100}%`,
                      }}
                    />
                  )}
                  {feature.failed > 0 && (
                    <div
                      className="bg-danger-500"
                      style={{
                        width: `${(feature.failed / feature.total) * 100}%`,
                      }}
                    />
                  )}
                  {feature.pending > 0 && (
                    <div
                      className="bg-warning-500"
                      style={{
                        width: `${(feature.pending / feature.total) * 100}%`,
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-success-500"></span>
                    {feature.passed}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-danger-500"></span>
                    {feature.failed}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-warning-500"></span>
                    {feature.pending}
                  </span>
                </div>
                <span className="text-slate-500 dark:text-slate-500">
                  {feature.total} total
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
