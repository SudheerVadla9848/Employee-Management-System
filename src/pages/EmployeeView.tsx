import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Department } from '../types';
import { useEmployees } from '../contexts/EmployeeContext';

import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import { Pencil, Trash2, Calendar, AtSign, Building, DollarSign, MapPin, FileText } from 'lucide-react';

const EmployeeView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEmployeeById, deleteEmployeeById, loading } = useEmployees();
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const employee = getEmployeeById(id || '');
  
  // Navigate back to search if employee not found
  useEffect(() => {
    if (!id || (!employee && !loading)) {
      navigate('/employees/search');
    }
  }, [id, employee, navigate, loading]);
  
  if (!employee) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const handleDelete = async () => {
    try {
      await deleteEmployeeById(id || '');
      navigate('/employees/search');
    } catch (err) {
      setError('Failed to delete employee');
    }
  };
  
  const getDepartmentColor = (department: Department): string => {
    switch (department) {
      case Department.Engineering:
        return 'blue';
      case Department.Support:
        return 'green';
      case Department.HR:
        return 'purple';
      case Department.Finance:
        return 'yellow';
      default:
        return 'gray';
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {error && (
        <div className="mb-6">
          <Alert variant="error\" title="Error\" onClose={() => setError(null)}>
            {error}
          </Alert>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Employee Details</h2>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/employees/search')}
            >
              Back to Search
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => navigate(`/employees/${id}/edit`)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            
            <Button
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Employee Overview */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                  <span className="text-2xl font-bold">
                    {employee.firstName.charAt(0)}
                    {employee.lastName.charAt(0)}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-center mb-1">
                  {employee.firstName} {employee.middleName ? `${employee.middleName} ` : ''}
                  {employee.lastName}
                </h3>
                
                <div className="flex justify-center mb-4">
                  <Badge variant={getDepartmentColor(employee.department) as any}>
                    {employee.department}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <AtSign className="h-4 w-4 mr-2" />
                    <span className="text-sm">{employee.loginId}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {format(employee.dateOfBirth, 'dd-MMM-yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    <span className="text-sm">{employee.department}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span className="text-sm">${employee.salary.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Employee Details */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                {/* Employee ID */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Employee ID
                  </h4>
                  <p className="text-lg font-semibold">{employee.id}</p>
                </div>
                
                {/* Addresses */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Permanent Address
                  </h4>
                  <div className="flex items-start mb-4">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <p className="text-gray-700">{employee.permanentAddress}</p>
                  </div>
                  
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Current Address
                  </h4>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <p className="text-gray-700">{employee.currentAddress}</p>
                  </div>
                </div>
                
                {/* ID Proof */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    ID Proof Document
                  </h4>
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    {employee.idProofUrl ? (
                      <a
                        href={employee.idProofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        View Document
                      </a>
                    ) : (
                      <span className="text-gray-500">No document available</span>
                    )}
                  </div>
                </div>
                
                {/* Timestamps */}
                <div className="border-t border-gray-200 pt-4 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Created At
                      </h4>
                      <p className="text-sm text-gray-600">
                        {format(employee.createdAt, 'dd-MMM-yyyy HH:mm')}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Last Updated
                      </h4>
                      <p className="text-sm text-gray-600">
                        {format(employee.updatedAt, 'dd-MMM-yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
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
                      Delete Employee
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this employee? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  isLoading={loading}
                  className="ml-3"
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
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

export default EmployeeView;