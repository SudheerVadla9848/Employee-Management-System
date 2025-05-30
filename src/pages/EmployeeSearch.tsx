import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { formatDate } from '../utils/validation';
import { Department, EmployeeSearchFilters, PaginationState } from '../types';
import { useEmployees } from '../contexts/EmployeeContext';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import DatePicker from '../components/ui/DatePicker';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const departmentOptions = [
  { value: Department.Engineering, label: 'Engineering' },
  { value: Department.Support, label: 'Support' },
  { value: Department.HR, label: 'HR' },
  { value: Department.Finance, label: 'Finance' },
];

const EmployeeSearch: React.FC = () => {
  const navigate = useNavigate();
  const { 
    searchResults, 
    searchEmployees, 
    loading, 
    error: apiError,
    selectedEmployees,
    toggleEmployeeSelection,
    clearSelectedEmployees,
    deleteSelectedEmployees,
    deleteEmployeeById
  } = useEmployees();
  
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
  });
  
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  
  const { register, control, handleSubmit, reset } = useForm<EmployeeSearchFilters>({
    defaultValues: {
      id: '',
      firstName: '',
      lastName: '',
      loginId: '',
      dobStart: null,
      dobEnd: null,
      department: '',
    },
  });
  
  // Initial load of employees
  useEffect(() => {
    searchEmployees({}, pagination);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Update when pagination changes
  useEffect(() => {
    const currentFilters = getValues();
    searchEmployees(currentFilters, pagination);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);
  
  // Show API errors
  useEffect(() => {
    if (apiError) {
      setError(apiError);
    }
  }, [apiError]);
  
  const { getValues } = useForm();
  
  const onSubmit = (data: EmployeeSearchFilters) => {
    // Reset to first page when performing a new search
    setPagination(prev => ({
      ...prev,
      page: 1,
    }));
    
    searchEmployees(data, { ...pagination, page: 1 });
  };
  
  const resetFilters = () => {
    reset();
    setPagination(prev => ({
      ...prev,
      page: 1,
    }));
    
    searchEmployees({}, { ...pagination, page: 1 });
  };
  
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage,
    }));
  };
  
  const confirmDelete = (id: string) => {
    setShowDeleteConfirm(id);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteEmployeeById(id);
      setShowDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete employee');
    }
  };
  
  const handleBulkDelete = async () => {
    try {
      await deleteSelectedEmployees();
      setShowBulkDeleteConfirm(false);
    } catch (err) {
      setError('Failed to delete selected employees');
    }
  };
  
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // Select all employees in the current view
      const allIds = searchResults.employees.map(emp => emp.id);
      allIds.forEach(id => {
        if (!selectedEmployees.includes(id)) {
          toggleEmployeeSelection(id);
        }
      });
    } else {
      // Deselect all
      clearSelectedEmployees();
    }
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(searchResults.pagination.total / pagination.limit);
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search Filters */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Employee Search</h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                id="id"
                label="Employee ID"
                placeholder="Search by ID"
                {...register('id')}
              />
              
              <Input
                id="firstName"
                label="First Name"
                placeholder="Search by first name"
                {...register('firstName')}
              />
              
              <Input
                id="lastName"
                label="Last Name"
                placeholder="Search by last name"
                {...register('lastName')}
              />
              
              <Input
                id="loginId"
                label="Login ID"
                placeholder="Search by login ID"
                {...register('loginId')}
              />
              
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Select
                    id="department"
                    label="Department"
                    options={departmentOptions}
                    {...field}
                  />
                )}
              />
              
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="dobStart"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="dobStart"
                      label="DOB Range (From)"
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd-MMM-yyyy"
                      showYearDropdown
                      showMonthDropdown
                      maxDate={new Date()}
                    />
                  )}
                />
                
                <Controller
                  name="dobEnd"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="dobEnd"
                      label="DOB Range (To)"
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd-MMM-yyyy"
                      showYearDropdown
                      showMonthDropdown
                      maxDate={new Date()}
                    />
                  )}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={resetFilters}
              >
                Reset
              </Button>
              
              <Button
                type="submit"
                isLoading={loading}
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Results Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Employee Results</h2>
          
          <div className="flex items-center space-x-3">
            {selectedEmployees.length > 0 && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowBulkDeleteConfirm(true)}
              >
                Delete Selected ({selectedEmployees.length})
              </Button>
            )}
            
            <Button
              onClick={() => navigate('/employees/add')}
            >
              Add Employee
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="p-4">
            <Alert
              variant="error"
              title="Error"
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      onChange={handleSelectAll}
                      checked={selectedEmployees.length === searchResults.employees.length && searchResults.employees.length > 0}
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Login ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Birth
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {searchResults.employees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                searchResults.employees.map((employee) => (
                  <tr 
                    key={employee.id}
                    className={
                      selectedEmployees.includes(employee.id)
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-50'
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => toggleEmployeeSelection(employee.id)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        <button onClick={() => navigate(`/employees/${employee.id}`)}>
                          {employee.id}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.loginId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(employee.dateOfBirth)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          employee.department === Department.Engineering
                            ? 'blue'
                            : employee.department === Department.Support
                            ? 'green'
                            : employee.department === Department.HR
                            ? 'purple'
                            : 'yellow'
                        }
                      >
                        {employee.department}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        ${employee.salary.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => navigate(`/employees/${employee.id}`)}
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() => navigate(`/employees/${employee.id}/edit`)}
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        {showDeleteConfirm === employee.id ? (
                          <div className="flex items-center space-x-1">
                            <button
                              className="text-green-600 hover:text-green-900"
                              onClick={() => handleDelete(employee.id)}
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => setShowDeleteConfirm(null)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => confirmDelete(employee.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {searchResults.employees.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, searchResults.pagination.total)}
              </span>{' '}
              of <span className="font-medium">{searchResults.pagination.total}</span> results
            </div>
            
            <nav className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Page numbers */}
              <div className="flex space-x-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded ${
                      pagination.page === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        )}
      </div>
      
      {/* Bulk Delete Confirmation */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-scale-in">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Selected Employees
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the {selectedEmployees.length} selected
                        employees? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="danger"
                  onClick={handleBulkDelete}
                  isLoading={loading}
                  className="ml-3"
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowBulkDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSearch;