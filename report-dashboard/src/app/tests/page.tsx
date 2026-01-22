'use client';

import { Suspense, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
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

function StatusIcon({ status }: { status: string }) {
  if (status === 'passed') {
    return (
      <svg
        className="w-5 h-5 text-success-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="20,6 9,17 4,12" />
      </svg>
    );
  }
  if (status === 'failed') {
    return (
      <svg
        className="w-5 h-5 text-danger-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }
  return (
    <svg
      className="w-5 h-5 text-warning-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function TestsContent() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status');
  const typeFilter = searchParams.get('type');

  const { filters } = useFilterStore();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(
    statusFilter
  );
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: testsData, isLoading } = useQuery({
    queryKey: ['tests', filters],
    queryFn: () => fetchTests(filters),
  });

  const tests = testsData?.items || [];

  // Filter tests based on URL params and search
  const filteredTests = useMemo(() => {
    let result = tests;

    if (selectedStatus) {
      result = result.filter((t) => t.status === selectedStatus);
    }

    if (typeFilter) {
      result = result.filter((t) => {
        const file = (t.file || '').toLowerCase();
        if (typeFilter === 'mock') return file.includes('mock');
        if (typeFilter === 'api' || typeFilter === 'integration')
          return file.includes('api');
        if (typeFilter === 'e2e')
          return !file.includes('mock') && !file.includes('api');
        return true;
      });
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          (t.suitePath || '').toLowerCase().includes(term) ||
          (t.file || '').toLowerCase().includes(term)
      );
    }

    return result;
  }, [tests, selectedStatus, typeFilter, searchTerm]);

  const statusCounts = useMemo(() => {
    return tests.reduce(
      (acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      },
      { passed: 0, failed: 0, pending: 0, skipped: 0 } as Record<string, number>
    );
  }, [tests]);

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <FilterBar />

      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-3xl font-bold gradient-text">
            Resultados dos Testes
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {filteredTests.length} de {tests.length} testes
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Pesquisar testes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </header>

      {/* Status Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedStatus(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            !selectedStatus
              ? 'bg-primary-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Todos ({tests.length})
        </button>
        <button
          onClick={() => setSelectedStatus('passed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedStatus === 'passed'
              ? 'bg-success-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Passou ({statusCounts.passed})
        </button>
        <button
          onClick={() => setSelectedStatus('failed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedStatus === 'failed'
              ? 'bg-danger-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Falhou ({statusCounts.failed})
        </button>
        <button
          onClick={() => setSelectedStatus('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedStatus === 'pending'
              ? 'bg-warning-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Pendente ({statusCounts.pending + (statusCounts.skipped || 0)})
        </button>
      </div>

      {/* Test List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <svg
            className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">
            Nenhum teste encontrado
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
            Tente ajustar os filtros
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              onClick={() => setSelectedTest(test)}
              className={`flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-500/50 transition-all cursor-pointer ${
                selectedTest?.id === test.id ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  test.status === 'passed'
                    ? 'bg-success-500/10'
                    : test.status === 'failed'
                      ? 'bg-danger-500/10'
                      : 'bg-warning-500/10'
                }`}
              >
                <StatusIcon status={test.status} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-900 dark:text-white truncate">
                  {test.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {test.suitePath}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                  {formatDuration(test.duration)}
                </span>
                <svg
                  className="w-5 h-5 text-slate-300 dark:text-slate-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Test Detail Modal */}
      {selectedTest && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTest(null)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 w-full max-w-3xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedTest.status === 'passed'
                      ? 'bg-success-500/10'
                      : selectedTest.status === 'failed'
                        ? 'bg-danger-500/10'
                        : 'bg-warning-500/10'
                  }`}
                >
                  <StatusIcon status={selectedTest.status} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Detalhes do Teste
                  </h3>
                  <span
                    className={`text-sm font-medium ${
                      selectedTest.status === 'passed'
                        ? 'text-success-500'
                        : selectedTest.status === 'failed'
                          ? 'text-danger-500'
                          : 'text-warning-500'
                    }`}
                  >
                    {selectedTest.status === 'passed'
                      ? 'Passou'
                      : selectedTest.status === 'failed'
                        ? 'Falhou'
                        : 'Pendente'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTest(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-slate-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Titulo
                </label>
                <p className="text-slate-900 dark:text-white font-medium mt-1">
                  {selectedTest.title}
                </p>
              </div>

              {/* Suite Path */}
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Caminho do Teste
                </label>
                <p className="text-slate-700 dark:text-slate-300 mt-1">
                  {selectedTest.suitePath}
                </p>
              </div>

              {/* File */}
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Arquivo
                </label>
                <p className="text-slate-700 dark:text-slate-300 mt-1 font-mono text-sm">
                  {selectedTest.file}
                </p>
              </div>

              {/* Duration */}
              <div className="flex gap-8">
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Duracao
                  </label>
                  <p className="text-slate-900 dark:text-white font-mono mt-1">
                    {formatDuration(selectedTest.duration)}
                  </p>
                </div>
              </div>

              {/* Error Message (if failed) */}
              {selectedTest.status === 'failed' &&
                selectedTest.errorMessage && (
                  <div>
                    <label className="text-xs font-medium text-danger-500 uppercase tracking-wide">
                      Mensagem de Erro
                    </label>
                    <pre className="mt-2 p-4 bg-danger-500/10 border border-danger-500/20 rounded-xl text-sm text-danger-600 dark:text-danger-400 overflow-x-auto whitespace-pre-wrap font-mono">
                      {selectedTest.errorMessage}
                    </pre>
                  </div>
                )}

              {/* Stack Trace (if failed) */}
              {selectedTest.status === 'failed' && selectedTest.errorStack && (
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Stack Trace
                  </label>
                  <pre className="mt-2 p-4 bg-slate-100 dark:bg-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-400 overflow-x-auto whitespace-pre-wrap font-mono max-h-48">
                    {selectedTest.errorStack}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
  );
}

export default function TestsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TestsContent />
    </Suspense>
  );
}
