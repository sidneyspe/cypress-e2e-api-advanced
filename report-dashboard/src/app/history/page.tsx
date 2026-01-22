'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FilterBar } from '@/components/filters';
import { HistoryList, HistoryModal } from '@/components/history';
import { Charts } from '@/components/dashboard';
import { useFilterStore } from '@/store/filters';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from '@/components/ui';
import type { ExecutionSummary, PaginatedResponse } from '@/types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

async function fetchExecutions(
  filters: Record<string, string[]>,
  page: number
): Promise<PaginatedResponse<ExecutionSummary>> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('pageSize', '20');

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

export default function HistoryPage() {
  const [selectedExecutionId, setSelectedExecutionId] = useState<number | null>(
    null
  );
  const [page, setPage] = useState(1);
  const { filters } = useFilterStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['executions-history', filters, page],
    queryFn: () => fetchExecutions(filters, page),
  });

  const executions = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Prepare chart data
  const historyChartData = executions
    .slice(0, 10)
    .reverse()
    .map((exec) => ({
      date: exec.date.split(' ')[0],
      passed: exec.passed,
      failed: exec.failed,
      passRate: exec.passRate,
    }));

  const aggregatedStats = executions.reduce(
    (acc, exec) => ({
      passed: acc.passed + exec.passed,
      failed: acc.failed + exec.failed,
      skipped: acc.skipped + exec.skipped,
      pending: acc.pending + exec.pending,
    }),
    { passed: 0, failed: 0, skipped: 0, pending: 0 }
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Historico de Execucoes
        </h2>
        <FilterBar />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-8 text-center text-danger-600">
            Erro ao carregar historico
          </CardContent>
        </Card>
      ) : (
        <>
          {executions.length > 0 && (
            <div className="mb-6">
              <Charts
                statusData={aggregatedStats}
                historyData={historyChartData}
              />
            </div>
          )}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                Execucoes ({total} {total === 1 ? 'registro' : 'registros'})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HistoryList
                executions={executions}
                onSelect={setSelectedExecutionId}
                selectedId={selectedExecutionId || undefined}
              />

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-gray-600">
                    Pagina {page} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Proxima
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {selectedExecutionId && (
        <HistoryModal
          executionId={selectedExecutionId}
          onClose={() => setSelectedExecutionId(null)}
        />
      )}
    </div>
  );
}
