'use client';

interface MetricsSectionProps {
  passRate: number;
  passed: number;
  failed: number;
  pending: number;
  duration: number;
  featureCount: number;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

export function MetricsSection({
  passRate,
  passed,
  failed,
  pending,
  duration,
  featureCount,
}: MetricsSectionProps) {
  const totalTests = passed + failed + pending;
  const avgDuration = totalTests > 0 ? duration / totalTests : 0;

  // Progress ring calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (passRate / 100) * circumference;

  // Health status
  const healthStatus =
    passRate >= 90 ? 'Excelente' : passRate >= 70 ? 'Bom' : 'Precisa Melhorar';
  const healthColor =
    passRate >= 90
      ? 'text-success-500'
      : passRate >= 70
        ? 'text-warning-500'
        : 'text-danger-500';
  const healthBg =
    passRate >= 90
      ? 'bg-success-500/10'
      : passRate >= 70
        ? 'bg-warning-500/10'
        : 'bg-danger-500/10';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Pass Rate Ring */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
          Taxa de Sucesso
        </h3>
        <div className="relative">
          <svg className="w-44 h-44 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-slate-200 dark:text-slate-700"
            />
            {/* Progress circle */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke={passRate >= 90 ? '#10b981' : passRate >= 70 ? '#f59e0b' : '#ef4444'}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="progress-ring-circle"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-slate-900 dark:text-white">
              {passRate.toFixed(1)}%
            </span>
            <span className={`text-sm font-medium ${healthColor}`}>
              {healthStatus}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-success-500"></span>
            <span className="text-slate-600 dark:text-slate-400">{passed}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-danger-500"></span>
            <span className="text-slate-600 dark:text-slate-400">{failed}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-warning-500"></span>
            <span className="text-slate-600 dark:text-slate-400">{pending}</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
          Metricas de Execucao
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Total Duration */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Duracao Total
              </span>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              {formatDuration(duration)}
            </span>
          </div>

          {/* Avg per Test */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-secondary-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-secondary-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Media por Teste
              </span>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              {formatDuration(avgDuration)}
            </span>
          </div>

          {/* Test Suites */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-info-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-info-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v11z" />
                </svg>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Suites de Teste
              </span>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {featureCount}
            </span>
          </div>

          {/* Health Status */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg ${healthBg} flex items-center justify-center`}>
                <svg
                  className={`w-5 h-5 ${healthColor}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Status de Saude
              </span>
            </div>
            <span className={`text-2xl font-bold ${healthColor}`}>
              {healthStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
