import { useState, useEffect } from 'react';
import Drawer from './Drawer';
import SearchBar from './SearchBar';
import type { FilterState } from '../hooks/useFilters';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters: FilterState;
  departments: string[];
  dataSubjects: string[];
}

const FilterDrawer = (props: FilterDrawerProps) => {
  const { isOpen, onClose, onApply, initialFilters, departments, dataSubjects } = props;

  const [localFilters, setLocalFilters] = useState<FilterState>(initialFilters);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  const handleSearchChange = (value: string) => {
    setLocalFilters(prev => ({ ...prev, search: value }));
  };

  const handleDepartmentChange = (dept: string) => {
    setLocalFilters(prev => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter(d => d !== dept)
        : [...prev.departments, dept]
    }));
  };

  const handleDataSubjectChange = (subject: string) => {
    setLocalFilters(prev => ({
      ...prev,
      dataSubjects: prev.dataSubjects.includes(subject)
        ? prev.dataSubjects.filter(s => s !== subject)
        : [...prev.dataSubjects, subject]
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
    const emptyFilters = { search: '', departments: [], dataSubjects: [] };
    setLocalFilters(emptyFilters);
    onApply(emptyFilters);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleReset}
      title="Filter"
      onSave={handleApply}
      loading={false}
      showIcon={true}
      saveButtonText="Apply Filter"
      cancelButtonText="Reset"
      contentPadding="px-6 py-1"
    >
      <div className="space-y-4">
        <SearchBar value={localFilters.search} onChange={handleSearchChange} />

        <div className="space-y-4">
          <h3 className="text-sm font-semibold">DEPARTMENT</h3>
          <div className="space-y-3">
            {departments.map((dept) => (
              <label key={dept} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.departments.includes(dept)}
                  onChange={() => handleDepartmentChange(dept)}
                  className="h-4 w-4 rounded border-gray-400 accent-[#009540] focus:outline-none"
                />
                <span className="text-black text-sm">{dept}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4 mt-8">
          <h3 className="text-sm font-semibold">DATA SUBJECT</h3>
          <div className="space-y-3">
            {dataSubjects.map((subject) => (
              <label key={subject} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.dataSubjects.includes(subject)}
                  onChange={() => handleDataSubjectChange(subject)}
                  className="h-4 w-4 rounded border-gray-400 accent-[#009540] focus:outline-none"
                />
                <span className="text-black text-sm">{subject}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default FilterDrawer;
