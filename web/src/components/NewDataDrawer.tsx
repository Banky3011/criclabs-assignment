import Drawer from './Drawer';

interface NewDataDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  loading: boolean;
  formData: {
    title: string;
    description: string;
    department: string;
    dataSubjectType: string[];
  };
  formErrors: Record<string, string>;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onDataSubjectToggle: (subject: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const NewDataDrawer = (props: NewDataDrawerProps) => {

  const {
    isOpen, onClose, onSave, loading, formData, formErrors, onFormChange, onDataSubjectToggle, onSubmit } = props;

  const dataSubjects = ["Employees", "Faculty Staff", "Students"];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="New Data"
      onSave={onSave}
      loading={loading}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {formErrors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
            {formErrors.general}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onFormChange}
            className={`w-full text-sm border rounded-md p-2 focus:border-myGreen focus:outline-none ${
              formErrors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder=""
          />
          {formErrors.title && (
            <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onFormChange}
            className="w-full text-sm border border-gray-300 rounded-md p-2 focus:border-myGreen focus:outline-none"
            rows={4}
            placeholder=""
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={onFormChange}
            className={`w-full border rounded-md p-2 text-sm focus:border-myGreen focus:outline-none ${
              formErrors.department ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Department</option>
            <option value="Human Resources">Human Resources</option>
            <option value="IT/IS">IT/IS</option>
            <option value="Admission">Admission</option>
          </select>
          {formErrors.department && (
            <p className="mt-1 text-sm text-red-600">{formErrors.department}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Data Subject Type
          </label>
          <div className="space-y-3">
            {dataSubjects.map((subject) => (
              <label key={subject} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dataSubjectType.includes(subject)}
                  onChange={() => onDataSubjectToggle(subject)}
                  className="h-4 w-4 rounded border-gray-400 accent-[#009540] focus:outline-none"
                />
                <span className="text-sm">{subject}</span>
              </label>
            ))}
          </div>
        </div>
      </form>
    </Drawer>
  );
};

export default NewDataDrawer;
