'use client';

import { Card, CardContent, Badge } from '@/components/ui';
import { formatDuration, formatDate } from '@/lib/utils';
import type { ExecutionSummary } from '@/types';

interface HistoryListProps {
  executions: ExecutionSummary[];
  onSelect: (id: number) => void;
  selectedId?: number;
}

export function HistoryList({ executions, onSelect, selectedId }: HistoryListProps) {
  if (executions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          Nenhuma execução encontrada
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {executions.map((execution) => (
        <Card
          key={execution.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedId === execution.id ? 'ring-2 ring-primary-500' : ''
          }`}
          onClick={() => onSelect(execution.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">
                    {formatDate(execution.date)}
                  </span>
                  <Badge
                    variant={execution.passRate >= 80 ? 'success' : execution.passRate >= 60 ? 'warning' : 'danger'}
                  >
                    {execution.passRate.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {execution.totalTests} testes
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {execution.passed}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-danger-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {execution.failed}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDuration(execution.duration)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {execution.squad && (
                    <Badge variant="outline" className="text-xs">
                      {execution.squad}
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
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
