import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

export function formatDate(dateStr: string): string {
  // Handle DD/MM/YYYY format
  if (dateStr.includes('/')) {
    return dateStr;
  }
  // Handle ISO format
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR');
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('pt-BR');
}

export function getHealthColor(passRate: number): string {
  if (passRate >= 90) return 'success';
  if (passRate >= 70) return 'warning';
  return 'danger';
}

export function getHealthText(passRate: number): string {
  if (passRate >= 90) return 'Excelente';
  if (passRate >= 70) return 'Bom';
  return 'Precisa Melhorar';
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'passed':
      return 'success';
    case 'failed':
      return 'danger';
    case 'pending':
    case 'skipped':
      return 'warning';
    default:
      return 'primary';
  }
}

export function parseJsonSafe<T>(json: string | null | undefined, defaultValue: T): T {
  if (!json) return defaultValue;
  try {
    return JSON.parse(json);
  } catch {
    return defaultValue;
  }
}

export function toDateKey(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

export function toDisplayDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-');
  return `${day}/${month}/${year}`;
}
