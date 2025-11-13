import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { getProfile, getAllDataMappings, createDataMapping } from '../utils/api';
import type { DataMapping } from '../utils/api';
import { z } from 'zod';
import {
  LayoutDashboard,
  GitBranch,
  FileText,
  Users,
  Database,
  Key,
  Shield,
  Plus,
  ArrowUpFromLine,
  ArrowDownToLine,
  Settings,
  ListFilter,  
  Trash,
  Pencil
} from 'lucide-react';
import Navbar from '../components/Navbar';

const dataMappingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  description: z.string().optional(),
  dataSubjectType: z.string().optional(),
});

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [profileData, setProfileData] = useState<any>(null);
  const [activeMenu, setActiveMenu] = useState('data-mapping');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dataMappings, setDataMappings] = useState<DataMapping[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    dataSubjectType: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Test protected route
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
    setDataMappings(prev => prev.filter(mapping => mapping.id !== id));
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Zod Validation
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
        // Reset form
        setFormData({
          title: '',
          description: '',
          department: '',
          dataSubjectType: ''
        });
        setFormErrors({});
        setIsDrawerOpen(false);
        // Refresh data
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
            <button
              onClick={() => setActiveMenu('data-mapping')}
              className={`flex items-center space-x-3 px-3 py-2 transition-colors text-left whitespace-nowrap md:w-full ${activeMenu === 'data-mapping' ? 'text-[#009540]' : 'text-gray-700'
                }`}
            >
              <GitBranch className={`w-5 h-5 flex-shrink-0 ${activeMenu === 'data-mapping' ? 'text-[#009540]' : 'text-gray-600'}`} />
              <span className="text-sm font-medium">Data Mapping</span>
            </button>

            <button
              onClick={() => setActiveMenu('governance')}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap md:w-full ${activeMenu === 'governance' ? 'text-[#009540]' : 'text-gray-700'
                }`}
            >
              <FileText className={`w-5 h-5 flex-shrink-0 ${activeMenu === 'governance' ? 'text-[#009540]' : 'text-gray-600'}`} />
              <span className="text-sm font-medium">Governance Document</span>
            </button>

            <button
              onClick={() => setActiveMenu('employee')}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap md:w-full ${activeMenu === 'employee' ? 'text-[#009540]' : 'text-gray-700'
                }`}
            >
              <Users className={`w-5 h-5 flex-shrink-0 ${activeMenu === 'employee' ? 'text-[#009540]' : 'text-gray-600'}`} />
              <span className="text-sm font-medium">Employee Awareness</span>
            </button>

            <button
              onClick={() => setActiveMenu('processors')}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap md:w-full ${activeMenu === 'processors' ? 'text-[#009540]' : 'text-gray-700'
                }`}
            >
              <Database className={`w-5 h-5 flex-shrink-0 ${activeMenu === 'processors' ? 'text-[#009540]' : 'text-gray-600'}`} />
              <span className="text-sm font-medium">Data Processors</span>
            </button>

            <button
              onClick={() => setActiveMenu('access-request')}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap md:w-full ${activeMenu === 'access-request' ? 'text-[#009540]' : 'text-gray-700'
                }`}
            >
              <Key className={`w-5 h-5 flex-shrink-0 ${activeMenu === 'access-request' ? 'text-[#009540]' : 'text-gray-600'}`} />
              <span className="text-sm font-medium">Subject Access Request</span>
            </button>

            <button
              onClick={() => setActiveMenu('breach')}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap md:w-full ${activeMenu === 'breach' ? 'text-[#009540]' : 'text-gray-700'
                }`}
            >
              <Shield className={`w-5 h-5 flex-shrink-0 ${activeMenu === 'breach' ? 'text-[#009540]' : 'text-gray-600'}`} />
              <span className="text-sm font-medium">Data breach register</span>
            </button>
          </nav>
        </aside>

        {/* Right Content */}
        <main className="p-8 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Main Content</h2>
          <div className="flex items-center justify-between mb-4">
            <p>Home / Current Path</p>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 bg-white border border-gray-300 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
                <ListFilter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter</span>
              </button>
              <button className="flex items-center space-x-2 bg-white border border-gray-300 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
                <ArrowDownToLine className="w-4 h-4" />
                <span className="text-sm font-medium">Import</span>
              </button>
              <button className="flex items-center space-x-2 bg-white border border-gray-300 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
                <ArrowUpFromLine className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center space-x-2 bg-[#009540] hover:bg-[#008030] border border-black text-white px-4 py-2 rounded-md"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New Data</span>
              </button>
            </div>
          </div>
          {/* Tabs Section */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveMenu('data-mapping')}
                className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${activeMenu === 'data-mapping'
                  ? 'border-[#009540]'
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
                  ? 'border-[#009540] text-[#009540]'
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
            ) : dataMappings.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No data mappings yet. Click "New Data" to add one.
              </div>
            ) : (
              <>
                <table className="min-w-full text-sm text-left text-gray-700">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 font-medium">Title</th>
                      <th className="px-6 py-3 font-medium">Description</th>
                      <th className="px-6 py-3 font-medium">Departments</th>
                      <th className="px-6 py-3 font-medium">Data Subject Types</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataMappings.map((mapping) => (
                      <tr key={mapping.id} className="border-b hover:bg-gray-50">
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
                            <Trash className="w-4 h-4"/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="px-6 py-3 text-sm text-gray-500 border-t bg-gray-50">
                  Showing 1–{dataMappings.length} of {dataMappings.length} results
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

      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[50] transition-opacity duration-300"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}


      {/* Right Drawer */}
      <div
        className={`fixed top-0 right-0 md:ml-[256px] mt-16 lg:mt-0 md:mt-0 h-full rounded-t-xl w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[60] ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between h-16 px-6 py-4 border-gray-200 border-b">
            <h2 className="text-md font-semibold">New Data</h2>
            <div className="items-center flex space-x-2">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  setFormData({ title: '', description: '', department: '', dataSubjectType: '' });
                  setFormErrors({});
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 font-semibold"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-[#009540] text-white font-semibold rounded-md hover:bg-[#008030] disabled:opacity-50"
                type="button"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>

          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6">
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
                  className={`w-full border rounded-md p-2 focus:border-[#009540] focus:outline-none ${
                    formErrors.title ? 'border-red-500' : 'border-gray-300'
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
                  className="w-full border border-gray-300 rounded-md p-2 focus:border-[#009540] focus:outline-none"
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
                  className={`w-full border rounded-md p-2 focus:border-[#009540] focus:outline-none ${
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
                <select
                  name="dataSubjectType"
                  value={formData.dataSubjectType}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:border-[#009540] focus:outline-none"
                >
                  <option value="">Select Data Subject Type</option>
                  <option value="Employees">Employees</option>
                  <option value="Faculty Staff">Faculty Staff</option>
                  <option value="Students">Students</option>
                </select>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  );
};

export default Home;