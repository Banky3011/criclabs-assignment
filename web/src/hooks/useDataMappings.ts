import { useState, useEffect } from 'react';
import { getAllDataMappings, createDataMapping, deleteDataMapping } from '../utils/api';
import type { DataMapping } from '../utils/api';
import { z } from 'zod';

const dataMappingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  description: z.string().optional(),
  dataSubjectType: z.array(z.string()).optional(),
});

export const useDataMappings = () => {
  const [dataMappings, setDataMappings] = useState<DataMapping[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    dataSubjectType: [] as string[]
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  useEffect(() => {
    fetchDataMappings();
  }, []);

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

  const handleDataSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      dataSubjectType: prev.dataSubjectType.includes(subject)
        ? prev.dataSubjectType.filter(s => s !== subject)
        : [...prev.dataSubjectType, subject]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = dataMappingSchema.safeParse(formData);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFormErrors(errors);
      return false;
    }

    try {
      setLoading(true);
      const response = await createDataMapping({
        title: formData.title,
        description: formData.description,
        department: formData.department,
        dataSubjectType: formData.dataSubjectType.join(', ') // Convert array to comma-separated string
      });

      if (response.success) {
        resetForm();
        fetchDataMappings();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create data mapping:', error);
      setFormErrors({ general: 'Failed to save data. Please try again.' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      department: '',
      dataSubjectType: []
    });
    setFormErrors({});
  };

  return {
    dataMappings,
    loading,
    formData,
    formErrors,
    handleDelete,
    handleFormChange,
    handleDataSubjectToggle,
    handleSubmit,
    resetForm,
    fetchDataMappings
  };
};
