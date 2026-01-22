'use client';

import { useFilterStore } from '@/store/filters';
import { Badge } from '@/components/ui';

const filterLabels: Record<string, string> = {
  squad: 'Squad',
  executionType: 'Tipo',
  product: 'Produto',
  module: 'Módulo',
  functionality: 'Funcionalidade',
};

export function ActiveFilters() {
  const { filters, toggleFilter, clearAllFilters, hasActiveFilters } = useFilterStore();

  if (!hasActiveFilters()) {
    return null;
  }

  const activeFilters = Object.entries(filters).filter(
    ([_, values]) => values.length > 0
  );

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <span className="text-sm font-medium text-gray-600">Filtros ativos:</span>

      {activeFilters.map(([key, values]) =>
        values.map((value) => (
          <Badge
            key={`${key}-${value}`}
            variant="secondary"
            className="flex items-center gap-1 pr-1"
          >
            <span className="text-gray-500">{filterLabels[key]}:</span>
            <span>{value}</span>
            <button
              onClick={() => toggleFilter(key as keyof typeof filters, value)}
              className="ml-1 p-0.5 hover:bg-gray-300 rounded-full transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Badge>
        ))
      )}

      <button
        onClick={clearAllFilters}
        className="ml-2 text-xs font-medium text-danger-600 hover:text-danger-700 transition-colors"
      >
        Limpar todos
      </button>
    </div>
  );
}
