import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { GitBranch, House, PenLine, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ButtonGroup from '../components/ButtonGroup';
import DataTable from '../components/DataTable';
import FilterDrawer from '../components/FilterDrawer';
import Button from '../components/Button';
import NewDataDrawer from '../components/NewDataDrawer';
import { useDataMappings } from '../hooks/useDataMappings';
import { useFilters } from '../hooks/useFilters';

const Home = () => {
  
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  
  const [activeMenu, setActiveMenu] = useState('data-mapping');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const departments = ["Human Resources", "IT/IS", "Admission", "Marketing"];
  const dataSubjects = ["Employees", "Faculty Staff", "Students"];

  const { dataMappings, loading, formData, formErrors, handleDelete, handleFormChange, handleDataSubjectToggle, handleSubmit, resetForm } = useDataMappings();
  const { appliedFilters, applyFilters } = useFilters();

  const filteredDataMappings = dataMappings.filter((mapping) => {
    const searchMatch = mapping.title.toLowerCase().includes(appliedFilters.search.toLowerCase());
    const departmentMatch = appliedFilters.departments.length === 0 || appliedFilters.departments.includes(mapping.department);
    
    const dataSubjectMatch = appliedFilters.dataSubjects.length === 0 || 
      appliedFilters.dataSubjects.some(subject => 
        mapping.dataSubjectType?.includes(subject)
      );
    
    return searchMatch && departmentMatch && dataSubjectMatch;
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, navigate]);

  const handleSave = async () => {
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;
    const success = await handleSubmit(syntheticEvent);
    if (success) {
      setIsDrawerOpen(false);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    resetForm();
  };

  const handleOpenFilter = () => {
    setIsFilterDrawerOpen(true);
  };

  const handleCloseFilter = () => {
    setIsFilterDrawerOpen(false);
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

      <div className="grid grid-cols-1 lg:grid-cols-[256px_1fr] lg:h-[calc(100vh-4rem)]">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

        <main className="px-6 py-2 lg:py-10 overflow-y-auto">
          <div className="flex items-center space-x-2 mb-4 text-sm">
            <House className="w-4 h-4" />
            <p>/</p>
            <p className="text-gray-400">Current Path</p>
          </div>

          <ButtonGroup
            onFilterClick={handleOpenFilter}
            onNewDataClick={() => setIsDrawerOpen(true)}
          />

          {/* Tabs Section */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveMenu('data-mapping')}
                className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeMenu === 'data-mapping'
                    ? 'border-[#009540]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <GitBranch
                  className={`w-4 h-4 ${
                    activeMenu === 'data-mapping' ? 'text-black' : 'text-gray-500'
                  }`}
                />
                <span>Data Mapping</span>
              </button>

              <button
                className={`pb-3 text-sm font-medium border-b-2 ${
                  activeMenu === 'collection-sources'
                    ? 'border-myGreen text-myGreen'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveMenu('collection-sources')}
              >
                Collection Sources
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-5">
            <Button
              icon={PenLine}
              label="Edit"
              onClick={() => setIsDrawerOpen(true)}
              variant="onlyBorder"
            />

            <Button
              icon={Eye}
              label="Visualize"
              onClick={() => setIsDrawerOpen(true)}
              variant="default"
            />
          </div>

          <DataTable
            dataMappings={filteredDataMappings}
            loading={loading}
            totalCount={dataMappings.length}
            onDelete={handleDelete}
          />

          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-6"
            onClick={handleLogout}
          >
            Logout
          </button>
        </main>
      </div>

      {/* Add new data drawer */}
      <NewDataDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSave={handleSave}
        loading={loading}
        formData={formData}
        formErrors={formErrors}
        onFormChange={handleFormChange}
        onDataSubjectToggle={handleDataSubjectToggle}
        onSubmit={handleSubmit}
      />

      {/* Filter data drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={handleCloseFilter}
        onApply={(filters) => {
          applyFilters(filters);
          setIsFilterDrawerOpen(false);
        }}
        initialFilters={appliedFilters}
        departments={departments}
        dataSubjects={dataSubjects}
      />
    </>
  );
};

export default Home;
