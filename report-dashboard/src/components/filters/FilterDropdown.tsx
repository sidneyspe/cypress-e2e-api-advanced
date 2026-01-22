'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { useFilterStore } from '@/store/filters';

type ColorClass =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger';

interface FilterDropdownProps {
  label: string;
  filterKey: 'squad' | 'executionType' | 'product' | 'module' | 'functionality';
  options: string[];
  colorClass?: ColorClass;
  icon?: ReactNode;
}

const colorStyles: Record<
  ColorClass,
  { bg: string; border: string; text: string; badge: string; ring: string }
> = {
  primary: {
    bg: 'bg-primary-500/10 hover:bg-primary-500/20',
    border: 'border-primary-500/20',
    text: 'text-primary-600 dark:text-primary-400',
    badge: 'bg-primary-500',
    ring: 'focus:ring-primary-500',
  },
  secondary: {
    bg: 'bg-secondary-500/10 hover:bg-secondary-500/20',
    border: 'border-secondary-500/20',
    text: 'text-secondary-600 dark:text-secondary-400',
    badge: 'bg-secondary-500',
    ring: 'focus:ring-secondary-500',
  },
  success: {
    bg: 'bg-success-500/10 hover:bg-success-500/20',
    border: 'border-success-500/20',
    text: 'text-success-600 dark:text-success-400',
    badge: 'bg-success-500',
    ring: 'focus:ring-success-500',
  },
  warning: {
    bg: 'bg-warning-500/10 hover:bg-warning-500/20',
    border: 'border-warning-500/20',
    text: 'text-warning-600 dark:text-warning-400',
    badge: 'bg-warning-500',
    ring: 'focus:ring-warning-500',
  },
  info: {
    bg: 'bg-info-500/10 hover:bg-info-500/20',
    border: 'border-info-500/20',
    text: 'text-info-600 dark:text-info-400',
    badge: 'bg-info-500',
    ring: 'focus:ring-info-500',
  },
  danger: {
    bg: 'bg-danger-500/10 hover:bg-danger-500/20',
    border: 'border-danger-500/20',
    text: 'text-danger-600 dark:text-danger-400',
    badge: 'bg-danger-500',
    ring: 'focus:ring-danger-500',
  },
};

export function FilterDropdown({
  label,
  filterKey,
  options,
  colorClass = 'primary',
  icon,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { filters, toggleFilter, clearFilter } = useFilterStore();
  const selectedValues = filters[filterKey] || [];
  const styles = colorStyles[colorClass];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (value: string) => {
    toggleFilter(filterKey, value);
  };

  const handleSelectAll = () => {
    options.forEach((option) => {
      if (!selectedValues.includes(option)) {
        toggleFilter(filterKey, option);
      }
    });
  };

  const handleClearAll = () => {
    clearFilter(filterKey);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 ${styles.bg} border ${styles.border} ${styles.text} rounded-lg text-sm font-medium transition-all`}
      >
        {icon}
        <span>{label}</span>
        {selectedValues.length > 0 && (
          <span
            className={`px-1.5 py-0.5 ${styles.badge} text-white text-xs rounded-full`}
          >
            {selectedValues.length}
          </span>
        )}
        <svg
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
          <div className="p-2 border-b border-slate-200 dark:border-slate-700">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 ${styles.ring}`}
            />
          </div>

          <div className="dropdown-options max-h-48 overflow-y-auto p-2 space-y-1">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                Nenhuma opcao encontrada
              </div>
            ) : (
              filteredOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option)}
                    onChange={() => handleToggle(option)}
                    className={`w-4 h-4 rounded border-slate-300 ${styles.text} ${styles.ring}`}
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {option}
                  </span>
                </label>
              ))
            )}
          </div>

          <div className="p-2 border-t border-slate-200 dark:border-slate-700 flex gap-2">
            <button
              onClick={handleSelectAll}
              className={`flex-1 px-2 py-1.5 text-xs font-medium ${styles.text} hover:${styles.bg} rounded-lg transition-colors`}
            >
              Selecionar Todos
            </button>
            <button
              onClick={handleClearAll}
              className="flex-1 px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
