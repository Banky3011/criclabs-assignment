import { useState } from 'react';

export interface FilterState {
  search: string;
  departments: string[];
  dataSubjects: string[];
}

export const useFilters = () => {
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    search: '',
    departments: [],
    dataSubjects: []
  });

  const applyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
  };

  const resetFilters = () => {
    setAppliedFilters({
      search: '',
      departments: [],
      dataSubjects: []
    });
  };

  return {
    appliedFilters,
    applyFilters,
    resetFilters
  };
};
