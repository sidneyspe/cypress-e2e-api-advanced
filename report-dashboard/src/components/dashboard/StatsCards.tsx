'use client';

import { useRouter } from 'next/navigation';

interface StatsCardsProps {
  totalTests: number;
  passed: number;
  failed: number;
  pending: number;
  passRate: number;
  failRate: number;
  pendingRate: number;
}

export function StatsCards({
  totalTests,
  passed,
  failed,
  pending,
  passRate,
  failRate,
  pendingRate,
}: StatsCardsProps) {
  const router = useRouter();

  const handleClick = (status?: string) => {
    if (status) {
      router.push(`/tests?status=${status}`);
    } else {
      router.push('/tests');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Tests */}
      <div
        onClick={() => handleClick()}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover-lift cursor-pointer border-l-4 border-l-info-500"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-info-500/10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-info-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            Total
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {totalTests}
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Total de Testes
            </p>
          </div>
          <div className="text-info-500 text-sm font-medium">100%</div>
        </div>
      </div>

      {/* Passed */}
      <div
        onClick={() => handleClick('passed')}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover-lift cursor-pointer border-l-4 border-l-success-500"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-success-500/10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-success-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20,6 9,17 4,12" />
            </svg>
          </div>
          <span className="text-xs font-medium text-success-500 uppercase tracking-wide">
            Passou
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {passed}
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Testes Aprovados
            </p>
          </div>
          <div className="text-success-500 text-sm font-medium">
            {passRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Failed */}
      <div
        onClick={() => handleClick('failed')}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover-lift cursor-pointer border-l-4 border-l-danger-500"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-danger-500/10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-danger-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <span className="text-xs font-medium text-danger-500 uppercase tracking-wide">
            Falhou
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {failed}
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Testes com Falha
            </p>
          </div>
          <div className="text-danger-500 text-sm font-medium">
            {failRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Pending */}
      <div
        onClick={() => handleClick('pending')}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover-lift cursor-pointer border-l-4 border-l-warning-500"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-warning-500/10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-warning-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </div>
          <span className="text-xs font-medium text-warning-500 uppercase tracking-wide">
            Pendente
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {pending}
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Testes Pendentes
            </p>
          </div>
          <div className="text-warning-500 text-sm font-medium">
            {pendingRate.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}
