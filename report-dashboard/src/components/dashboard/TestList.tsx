'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { formatDuration } from '@/lib/utils';
import type { TestResult } from '@/types';

interface TestListProps {
  tests: TestResult[];
  title?: string;
}

const statusColors: Record<string, 'success' | 'danger' | 'warning' | 'secondary'> = {
  passed: 'success',
  failed: 'danger',
  skipped: 'warning',
  pending: 'secondary',
};

const statusLabels: Record<string, string> = {
  passed: 'Passou',
  failed: 'Falhou',
  skipped: 'Pulado',
  pending: 'Pendente',
};

export function TestList({ tests, title = 'Testes' }: TestListProps) {
  const [filter, setFilter] = useState<string>('all');
  const [expandedTest, setExpandedTest] = useState<string | null>(null);

  const filteredTests = filter === 'all'
    ? tests
    : tests.filter((test) => test.status === filter);

  const statusCounts = tests.reduce(
    (acc, test) => {
      acc[test.status] = (acc[test.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title} ({filteredTests.length})</CardTitle>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({tests.length})
            </button>
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {statusLabels[status]} ({count})
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
          {filteredTests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum teste encontrado
            </div>
          ) : (
            filteredTests.map((test) => (
              <div
                key={test.id}
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedTest(expandedTest === test.testId ? null : test.testId)
                  }
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={statusColors[test.status]}>
                        {statusLabels[test.status]}
                      </Badge>
                      <span className="font-medium text-gray-900">{test.title}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {test.file && (
                        <span className="text-xs text-gray-500 font-mono">
                          {test.file}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {formatDuration(test.duration)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {test.squad && (
                        <Badge variant="outline" className="text-xs">
                          Squad: {test.squad}
                        </Badge>
                      )}
                      {test.executionType && (
                        <Badge variant="outline" className="text-xs">
                          {test.executionType}
                        </Badge>
                      )}
                      {test.product && (
                        <Badge variant="outline" className="text-xs">
                          {test.product}
                        </Badge>
                      )}
                      {test.module && (
                        <Badge variant="outline" className="text-xs">
                          {test.module}
                        </Badge>
                      )}
                      {test.functionality && (
                        <Badge variant="outline" className="text-xs">
                          {test.functionality}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedTest === test.testId ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {expandedTest === test.testId && (
                  <div className="mt-3 pt-3 border-t">
                    {test.fullTitle && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-gray-500">Título Completo:</span>
                        <p className="text-sm text-gray-700">{test.fullTitle}</p>
                      </div>
                    )}
                    {test.errorMessage && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-danger-600">Erro:</span>
                        <pre className="mt-1 p-2 bg-danger-50 text-danger-700 text-xs rounded overflow-x-auto">
                          {test.errorMessage}
                        </pre>
                      </div>
                    )}
                    {test.errorStack && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-gray-500">Stack Trace:</span>
                        <pre className="mt-1 p-2 bg-gray-100 text-gray-700 text-xs rounded overflow-x-auto max-h-40">
                          {test.errorStack}
                        </pre>
                      </div>
                    )}
                    {test.code && (
                      <div>
                        <span className="text-xs font-medium text-gray-500">Código:</span>
                        <pre className="mt-1 p-2 bg-gray-900 text-gray-100 text-xs rounded overflow-x-auto max-h-60">
                          {test.code}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
