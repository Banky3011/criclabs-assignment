import { ChevronsUpDown, Pencil, Trash } from 'lucide-react';
import type { DataMapping } from '../utils/api';

interface DataTableProps {
  dataMappings: DataMapping[];
  loading: boolean;
  totalCount: number;
  onDelete: (id: number) => void;
}

const DataTable = (props: DataTableProps) => {
  const { dataMappings, loading, totalCount, onDelete } = props;

  if (loading && dataMappings.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden px-6">
        <div className="px-6 py-12 text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (dataMappings.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden px-6">
        <div className="px-6 py-12 text-center text-gray-500">
          {totalCount === 0
            ? 'No data mappings yet. Click "New Data" to add one.'
            : 'No results match your filters.'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden px-6">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="border-b border-gray-200 text-gray-400 h-12">
          <tr>
            <th className="py-3 pr-6 font-medium">
              <div className="flex items-center space-x-12">
                <span>Title</span>
                <ChevronsUpDown className="w-4 h-4 flex-shrink-0" />
              </div>
            </th>
            <th className="py-3 pr-6 font-medium">
              <div className="flex items-center space-x-12">
                <span>Description</span>
                <ChevronsUpDown className="w-4 h-4 flex-shrink-0" />
              </div>
            </th>
            <th className="py-3 pr-6 font-medium">
              <div className="flex items-center space-x-12">
                <span>Departments</span>
                <ChevronsUpDown className="w-4 h-4 flex-shrink-0" />
              </div>
            </th>
            <th className="py-3 pr-6 font-medium">
              <div className="flex items-center space-x-12">
                <span>Data Subject Types</span>
                <ChevronsUpDown className="w-4 h-4 flex-shrink-0" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {dataMappings.map((mapping) => (
            <tr
              key={mapping.id}
              className="border-b-1 border-gray-200 hover:bg-gray-50 h-12"
            >
              <td className="py-3 pr-6">{mapping.title}</td>
              <td className="py-3 pr-6 max-w-xs break-words whitespace-normal">{mapping.description || '-'}</td>
              <td className="py-3 pr-6">{mapping.department}</td>
              <td className="py-3 pr-6">{mapping.dataSubjectType}</td>
              <td className="py-3 text-right space-x-2">
                <div className="flex mr-4 lg:mr-0">
                  <button className="text-black hover:text-green-600 mr-8">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => mapping.id && onDelete(mapping.id)}
                    className="text-red-500 hover:text-red-700 mr-20"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div className="px-6 py-3 text-sm text-gray-500 flex justify-end">
        Showing 1-{dataMappings.length} of {totalCount} results
      </div>
    </div>
  );
};

export default DataTable;
