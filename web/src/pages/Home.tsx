import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { getProfile, getAllDataMappings, createDataMapping, deleteDataMapping } from '../utils/api';
import type { DataMapping } from '../utils/api';
import { z } from 'zod';
import {
  GitBranch,
  FileText,
  Users,
  Database,
  Key,
  Shield,
  Plus,
  ArrowUpFromLine,
  ArrowDownToLine,
  ListFilter,
  Trash,
  Pencil,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import SidebarMenuItem from '../components/SidebarMenuItem';
import Button from '../components/Button';
import Drawer from '../components/Drawer';
import SearchBar from '../components/SearchBar';

const dataMappingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  description: z.string().optional(),
  dataSubjectType: z.string().optional(),
});

const Home = () => {

  const navigate = useNavigate();

  const departments = ["Human Resources", "IT/IS", "Admission", "Marketing"];
  const dataSubjects = ["Employees", "Faculty Staff", "Students"];

  const { user, isAuthenticated, logout } = useAuthStore();
  const [profileData, setProfileData] = useState<any>(null);
  const [activeMenu, setActiveMenu] = useState('data-mapping');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [dataMappings, setDataMappings] = useState<DataMapping[]>([]);
  const [loading, setLoading] = useState(false);

  const [tempSelectedDepartments, setTempSelectedDepartments] = useState<string[]>([]);
  const [tempSelectedDataSubjects, setTempSelectedDataSubjects] = useState<string[]>([]);

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedDataSubjects, setSelectedDataSubjects] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    dataSubjectType: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredDataMappings = dataMappings.filter((mapping) => {
    const departmentMatch = selectedDepartments.length === 0 || selectedDepartments.includes(mapping.department);
    const dataSubjectMatch = selectedDataSubjects.length === 0 || selectedDataSubjects.includes(mapping.dataSubjectType || '');
    return departmentMatch && dataSubjectMatch;
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfileData(data);
        console.log('Protected route response:', data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
    fetchDataMappings();
  }, [isAuthenticated, navigate]);

  const fetchDataMappings = async () => {
    try {
      setLoading(true);
      const response = await getAllDataMappings();
      if (response.success) {
        setDataMappings(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch data mappings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteDataMapping(id);
      if (response.success) {
        setDataMappings(prev => prev.filter(mapping => mapping.id !== id));
      } else {
        console.error('Failed to delete data mapping');
      }
    } catch (error) {
      console.error('Error deleting data mapping:', error);
    }
  }

  const handleDepartmentChange = (department: string) => {
    setTempSelectedDepartments(prev =>
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  const handleDataSubjectChange = (dataSubject: string) => {
    setTempSelectedDataSubjects(prev =>
      prev.includes(dataSubject)
        ? prev.filter(d => d !== dataSubject)
        : [...prev, dataSubject]
    );
  };

  const handleApplyFilter = () => {
    // Apply the temporary filters
    setSelectedDepartments(tempSelectedDepartments);
    setSelectedDataSubjects(tempSelectedDataSubjects);
    setIsFilterDrawerOpen(false);
  };

  const handleResetFilter = () => {
    setTempSelectedDepartments([]);
    setTempSelectedDataSubjects([]);
    setSelectedDepartments([]);
    setSelectedDataSubjects([]);
    setIsFilterDrawerOpen(false);
  };

  const handleOpenFilterDrawer = () => {
    // Initialize temp state with current applied filters
    setTempSelectedDepartments(selectedDepartments);
    setTempSelectedDataSubjects(selectedDataSubjects);
    setIsFilterDrawerOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = dataMappingSchema.safeParse(formData);

    if (!result.success) {
      // Convert Zod errors to a more usable format
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const response = await createDataMapping({
        title: formData.title,
        description: formData.description,
        department: formData.department,
        dataSubjectType: formData.dataSubjectType
      });

      if (response.success) {
        setFormData({
          title: '',
          description: '',
          department: '',
          dataSubjectType: ''
        });
        setFormErrors({});
        setIsDrawerOpen(false);
        fetchDataMappings();
      }
    } catch (error) {
      console.error('Failed to create data mapping:', error);
      setFormErrors({ general: 'Failed to save data. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = () => {
    const syntheticEvent = {
      preventDefault: () => { },
    } as React.FormEvent;
    handleSubmit(syntheticEvent);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="grid grid-cols-1 md:grid-cols-[256px_1fr] md:h-[calc(100vh-4rem)]">
        {/* Left Sidebar */}
        <aside className="h-16 md:h-full overflow-x-auto md:overflow-x-visible overflow-y-hidden md:overflow-y-auto">
          <nav className="flex md:flex-col items-center md:items-start md:space-y-1 space-x-2 md:space-x-0 px-8 py-4 md:py-8 min-w-max md:min-w-0">
            <SidebarMenuItem
              icon={GitBranch}
              label="Data Mapping"
              onClick={() => setActiveMenu('data-mapping')}
              isActive={activeMenu === 'data-mapping'}
            />

            <SidebarMenuItem
              icon={FileText}
              label="Governance Document"
              onClick={() => setActiveMenu('governance')}
              isActive={activeMenu === 'governance'}
            />

            <SidebarMenuItem
              icon={Users}
              label="Employee Awareness"
              onClick={() => setActiveMenu('employee')}
              isActive={activeMenu === 'employee'}
            />

            <SidebarMenuItem
              icon={Database}
              label="Data Processors"
              onClick={() => setActiveMenu('processors')}
              isActive={activeMenu === 'processors'}
            />

            <SidebarMenuItem
              icon={Key}
              label="Subject Access Request"
              onClick={() => setActiveMenu('access-request')}
              isActive={activeMenu === 'access-request'}
            />

            <SidebarMenuItem
              icon={Shield}
              label="Data breach register"
              onClick={() => setActiveMenu('breach')}
              isActive={activeMenu === 'breach'}
            />
          </nav>
        </aside>

        {/* Right Content */}
        <main className="p-8 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Main Content</h2>
          <div className="flex items-center justify-between mb-4">
            <p>Home / Current Path</p>
            <div className="flex items-center space-x-2">
              <Button
                icon={ListFilter}
                onClick={handleOpenFilterDrawer}
                label="Filter"
              />
              <Button
                icon={ArrowDownToLine}
                label="Import"
              />
              <Button
                icon={ArrowUpFromLine}
                label="Export"
              />
              <Button
                icon={Plus}
                label="New Data"
                onClick={() => setIsDrawerOpen(true)}
                variant="primary"
              />
            </div>
          </div>
          {/* Tabs Section */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveMenu('data-mapping')}
                className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${activeMenu === 'data-mapping'
                  ? 'border-myGreen'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                <GitBranch
                  className={`w-4 h-4 ${activeMenu === 'data-mapping' ? 'text-black' : 'text-gray-500'
                    }`}
                />
                <span>Data Mapping</span>
              </button>


              <button
                className={`pb-3 text-sm font-medium border-b-2 ${activeMenu === 'collection-sources'
                  ? 'border-myGreen text-myGreen'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                onClick={() => setActiveMenu('collection-sources')}
              >
                Collection Sources
              </button>
            </div>
          </div>

          {/* Data Table Section */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {loading && dataMappings.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                Loading...
              </div>
            ) : filteredDataMappings.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                {dataMappings.length === 0 ? 'No data mappings yet. Click "New Data" to add one.' : 'No results match your filters.'}
              </div>
            ) : (
              <>
                <table className="min-w-full text-sm text-left text-gray-700">
                  <thead className="bg-gray-50 border-b text-gray-300">
                    <tr>
                      <th className="px-6 py-3 font-medium">Title</th>
                      <th className="px-6 py-3 font-medium">Description</th>
                      <th className="px-6 py-3 font-medium">Departments</th>
                      <th className="px-6 py-3 font-medium">Data Subject Types</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDataMappings.map((mapping) => (
                      <tr key={mapping.id} className="border-b-1 hover:bg-gray-50">
                        <td className="px-6 py-3">{mapping.title}</td>
                        <td className="px-6 py-3">{mapping.description || '-'}</td>
                        <td className="px-6 py-3">{mapping.department}</td>
                        <td className="px-6 py-3">{mapping.dataSubjectType}</td>
                        <td className="px-6 py-3 text-right space-x-2">
                          <button className="text-black hover:text-green-600 mr-3">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => mapping.id && handleDelete(mapping.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="px-6 py-3 text-sm text-gray-500 border-t bg-gray-50">
                  Showing {filteredDataMappings.length} of {dataMappings.length} results
                </div>
              </>
            )}
          </div>

          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-6"
            onClick={handleLogout}
          >
            Logout
          </button>
        </main>
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setFormData({ title: '', description: '', department: '', dataSubjectType: '' });
          setFormErrors({});
        }}
        title="New Data"
        onSave={handleSave}
        loading={loading}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
              onChange={handleFormChange}
              className={`w-full border rounded-md p-2 focus:border-myGreen focus:outline-none ${formErrors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter title"
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
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:border-myGreen focus:outline-none"
              rows={4}
              placeholder="Enter description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleFormChange}
              className={`w-full border rounded-md p-2 focus:border-myGreen focus:outline-none ${formErrors.department ? 'border-red-500' : 'border-gray-300'
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
            <select
              name="dataSubjectType"
              value={formData.dataSubjectType}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:border-myGreen focus:outline-none"
            >
              <option value="">Select Data Subject Type</option>
              <option value="Employees">Employees</option>
              <option value="Faculty Staff">Faculty Staff</option>
              <option value="Students">Students</option>
            </select>
          </div>
        </form>
      </Drawer>

      <Drawer
        isOpen={isFilterDrawerOpen}
        onClose={handleResetFilter}
        title="Filter"
        onSave={handleApplyFilter}
        loading={false}
        showIcon={true}
        saveButtonText="Apply Filter"
        cancelButtonText="Reset"
        contentPadding="px-6 py-1"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formErrors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
              {formErrors.general}
            </div>
          )}

          <SearchBar />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">DEPARTMENT</h3>
            <div className="space-y-3">
              {departments.map((dept) => (
                <label key={dept} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSelectedDepartments.includes(dept)}
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
                    checked={selectedDataSubjects.includes(subject)}
                    onChange={() => handleDataSubjectChange(subject)}
                    className="h-4 w-4 rounded border-gray-400 accent-[#009540] focus:outline-none"
                  />
                  <span className="text-black text-sm">{subject}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
      </Drawer>

    </>
  );
};

export default Home;