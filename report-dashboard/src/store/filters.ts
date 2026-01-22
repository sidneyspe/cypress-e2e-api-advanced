import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FilterState, TagOptions } from '@/types';

interface FilterStore {
  filters: FilterState;
  tagOptions: TagOptions;
  setFilter: (key: keyof FilterState, values: string[]) => void;
  toggleFilter: (key: keyof FilterState, value: string) => void;
  clearFilter: (key: keyof FilterState) => void;
  clearAllFilters: () => void;
  setTagOptions: (options: TagOptions) => void;
  hasActiveFilters: () => boolean;
}

const initialFilters: FilterState = {
  squad: [],
  executionType: [],
  product: [],
  module: [],
  functionality: [],
  status: [],
};

const initialTagOptions: TagOptions = {
  squads: [],
  executionTypes: [],
  products: [],
  modules: [],
  functionalities: [],
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set, get) => ({
      filters: initialFilters,
      tagOptions: initialTagOptions,

      setFilter: (key, values) =>
        set((state) => ({
          filters: { ...state.filters, [key]: values },
        })),

      toggleFilter: (key, value) =>
        set((state) => {
          const currentValues = state.filters[key] as string[];
          const newValues = currentValues.includes(value)
            ? currentValues.filter((v) => v !== value)
            : [...currentValues, value];
          return { filters: { ...state.filters, [key]: newValues } };
        }),

      clearFilter: (key) =>
        set((state) => ({
          filters: { ...state.filters, [key]: [] },
        })),

      clearAllFilters: () =>
        set({ filters: initialFilters }),

      setTagOptions: (options) =>
        set({ tagOptions: options }),

      hasActiveFilters: () => {
        const { filters } = get();
        return Object.values(filters).some(
          (arr) => Array.isArray(arr) && arr.length > 0
        );
      },
    }),
    {
      name: 'cypress-report-filters',
      partialize: (state) => ({ filters: state.filters }),
    }
  )
);
