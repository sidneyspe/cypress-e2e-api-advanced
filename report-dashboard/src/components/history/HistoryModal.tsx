'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
} from '@/components/ui';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { TestList } from '@/components/dashboard/TestList';
import { formatDate, formatDuration } from '@/lib/utils';
import type { ExecutionDetail } from '@/types';

interface HistoryModalProps {
  executionId: number;
  onClose: () => void;
}

async function fetchExecutionDetail(id: number): Promise<ExecutionDetail> {
  const response = await fetch(`/api/executions/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch execution details');
  }
  const data = await response.json();
  return data.data;
}

export function HistoryModal({ executionId, onClose }: HistoryModalProps) {
  const {
    data: execution,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['execution', executionId],
    queryFn: () => fetchExecutionDetail(executionId),
  });

  if (isLoading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content p-8" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !execution) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content p-8" onClick={(e) => e.stopPropagation()}>
          <div className="text-center text-danger-600">
            Erro ao carregar detalhes da execução
          </div>
          <Button onClick={onClose} className="mt-4">
            Fechar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Execução de {formatDate(execution.date)}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant={
                  execution.passRate >= 80
                    ? 'success'
                    : execution.passRate >= 60
                      ? 'warning'
                      : 'danger'
                }
              >
                {execution.passRate.toFixed(1)}% de sucesso
              </Badge>
              <span className="text-sm text-gray-500">
                Duração: {formatDuration(execution.duration)}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {execution.squad && (
                <Badge variant="outline" className="text-xs">
                  Squad: {execution.squad}
                </Badge>
              )}
              {execution.executionType && (
                <Badge variant="outline" className="text-xs">
                  {execution.executionType}
                </Badge>
              )}
              {execution.product && (
                <Badge variant="outline" className="text-xs">
                  {execution.product}
                </Badge>
              )}
              {execution.module && (
                <Badge variant="outline" className="text-xs">
                  {execution.module}
                </Badge>
              )}
              {execution.functionality && (
                <Badge variant="outline" className="text-xs">
                  {execution.functionality}
                </Badge>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto scrollbar-thin">
          <div className="mb-6">
            <StatsCards
              totalTests={execution.totalTests}
              passed={execution.passed}
              failed={execution.failed}
              pending={execution.pending + execution.skipped}
              passRate={execution.passRate}
              failRate={
                execution.totalTests > 0
                  ? (execution.failed / execution.totalTests) * 100
                  : 0
              }
              pendingRate={
                execution.totalTests > 0
                  ? ((execution.pending + execution.skipped) /
                      execution.totalTests) *
                    100
                  : 0
              }
            />
          </div>

          <TestList
            tests={execution.tests || []}
            title="Testes desta Execução"
          />
        </div>
      </div>
    </div>
  );
}
