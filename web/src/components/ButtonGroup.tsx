import { Plus, ArrowUpFromLine, ArrowDownToLine, ListFilter } from 'lucide-react';

interface ButtonGroupProps {
  onFilterClick: () => void;
  onNewDataClick: () => void;
}

const ButtonGroup = (props: ButtonGroupProps) => {

  const { onFilterClick, onNewDataClick } = props;
  
  return (
    <div className="mb-4 md:mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold mb-3 md:mb-4">Data Mapping</h2>
        <div className="flex items-center space-x-3 md:space-x-2">
          {/* Mobile: Icon only, Desktop: Icon + Label */}
          <button
            onClick={onFilterClick}
            className="p-3 md:p-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center md:px-4"
          >
            <ListFilter className="w-4 h-4" />
            <span className="hidden md:inline ml-2">Filter</span>
          </button>
          
          <button className="p-3 md:p-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center md:px-4">
            <ArrowDownToLine className="w-4 h-4" />
            <span className="hidden md:inline ml-2">Import</span>
          </button>
          
          <button className="p-3 md:p-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center md:px-4">
            <ArrowUpFromLine className="w-4 h-4" />
            <span className="hidden md:inline ml-2">Export</span>
          </button>
          
          <button
            onClick={onNewDataClick}
            className="py-3 md:py-2 px-8 lg:px-2 bg-[#009540] text-white rounded-md hover:bg-[#007a35] flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ButtonGroup;
