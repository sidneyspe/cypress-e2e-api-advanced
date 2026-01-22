'use client';

import { useRouter } from 'next/navigation';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartEvent,
  ActiveElement,
  TooltipItem,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface ChartsSectionProps {
  passed: number;
  failed: number;
  pending: number;
  testDistribution: {
    e2e: number;
    mock: number;
    integration: number;
    unit: number;
  };
}

export function ChartsSection({
  passed,
  failed,
  pending,
  testDistribution,
}: ChartsSectionProps) {
  const router = useRouter();
  const total = passed + failed + pending;

  const donutData = {
    labels: ['Passou', 'Falhou', 'Pendente'],
    datasets: [
      {
        data: [passed, failed, pending],
        backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
        borderColor: ['#10b981', '#ef4444', '#f59e0b'],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle' as const,
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 13, weight: 600 as const },
        bodyFont: { size: 12 },
        callbacks: {
          label: function (context: TooltipItem<'doughnut'>) {
            const value = context.raw as number;
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    onClick: (_event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const statuses = ['passed', 'failed', 'pending'];
        router.push(`/tests?status=${statuses[index]}`);
      }
    },
  };

  const barData = {
    labels: ['E2E', 'Mock', 'Integracao', 'Unitario'],
    datasets: [
      {
        label: 'Testes',
        data: [
          testDistribution.e2e,
          testDistribution.mock,
          testDistribution.integration,
          testDistribution.unit,
        ],
        backgroundColor: ['#6366f1', '#d946ef', '#3b82f6', '#8b5cf6'],
        borderRadius: 8,
        borderSkipped: false as const,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 13, weight: 600 as const },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
        },
      },
    },
    onClick: (_event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const types = ['e2e', 'mock', 'api', 'unit'];
        router.push(`/tests?type=${types[index]}`);
      }
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Donut Chart - Test Results Distribution */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Distribuicao dos Resultados
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Clique para ver detalhes
            </p>
          </div>
        </div>
        <div className="h-72 flex items-center justify-center">
          <Doughnut data={donutData} options={donutOptions} />
        </div>
      </div>

      {/* Bar Chart - Test Type Distribution */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Distribuicao por Tipo de Teste
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Clique nas barras para detalhes
            </p>
          </div>
        </div>
        <div className="h-72">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}
