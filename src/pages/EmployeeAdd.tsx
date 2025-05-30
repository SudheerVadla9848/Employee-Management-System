import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { differenceInYears } from 'date-fns';
import { Department } from '../types';
import { useEmployees } from '../contexts/EmployeeContext';

import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import TextArea from '../components/ui/TextArea';
import DatePicker from '../components/ui/DatePicker';
import Button from '../components/ui/Button';
import FileUpload from '../components/ui/FileUpload';
import Alert from '../components/ui/Alert';

const departmentOptions = [
  { value: Department.Engineering, label: 'Engineering' },
  { value: Department.Support, label: 'Support' },
  { value: Department.HR, label: 'HR' },
  { value: Department.Finance, label: 'Finance' },
];

const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
    invalid_type_error: 'Invalid date format',
  }).refine(date => differenceInYears(new Date(), date) >= 18, {
    message: 'Employee must be at least 18 years old',
  }),
  department: z.nativeEnum(Department, {
    required_error: 'Department is required',
  }),
  salary: z.coerce.number({
    required_error: 'Salary is required',
    invalid_type_error: 'Salary must be a number',
  }).min(1, 'Salary must be greater than 0'),
  permanentAddress: z.string().min(1, 'Permanent address is required'),
  currentAddress: z.string().min(1, 'Current address is required'),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

const EmployeeAdd: React.FC = () => {
  const navigate = useNavigate();
  const { addNewEmployee, loading, error: employeeError } = useEmployees();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      dateOfBirth: null as any,
      department: undefined,
      salary: undefined,
    },
  });

  // Set current address same as permanent address
  const permanentAddress = watch('permanentAddress');

  const setSameAddress = () => {
    setValue('currentAddress', permanentAddress, { shouldValidate: true });
  };

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      setError(null);
      setSuccess(null);
      
      if (!idProofFile) {
        setError('ID proof document is required');
        return;
      }
      
      const employeeData = {
        ...data,
        idProofFile,
      };
      
      const result = await addNewEmployee(employeeData);
      setSuccess(`Employee added successfully with ID: ${result.id}`);
      
      // Reset the form after successful submission
      reset();
      setIdProofFile(null);
      
      // Navigate to the employee view page after a short delay
      setTimeout(() => {
        navigate(`/employees/${result.id}`);
      }, 2000);
    } catch (err) {
      setError('Failed to add employee. Please try again.');
    }
  };

  // Display API errors
  useEffect(() => {
    if (employeeError) {
      setError(employeeError);
    }
  }, [employeeError]);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add New Employee</h2>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-6">
              <Alert variant="error\" title="Error\" onClose={() => setError(null)}>
                {error}
              </Alert>
            </div>
          )}
          
          {success && (
            <div className="mb-6">
              <Alert variant="success" title="Success" onClose={() => setSuccess(null)}>
                {success}
              </Alert>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="md:col-span-1">
                <Input
                  id="firstName"
                  label="First Name"
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
              </div>
              
              <div className="md:col-span-1">
                <Input
                  id="middleName"
                  label="Middle Name (Optional)"
                  error={errors.middleName?.message}
                  {...register('middleName')}
                />
              </div>
              
              <div className="md:col-span-1">
                <Input
                  id="lastName"
                  label="Last Name"
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>
              
              <div className="md:col-span-1">
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="dateOfBirth"
                      label="Date of Birth"
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      error={errors.dateOfBirth?.message}
                      dateFormat="dd-MMM-yyyy"
                      showYearDropdown
                      showMonthDropdown
                      maxDate={new Date()}
                    />
                  )}
                />
              </div>
              
              <div className="md:col-span-1">
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="department"
                      label="Department"
                      options={departmentOptions}
                      error={errors.department?.message}
                      {...field}
                    />
                  )}
                />
              </div>
              
              <div className="md:col-span-1">
                <Input
                  id="salary"
                  label="Salary"
                  type="number"
                  error={errors.salary?.message}
                  {...register('salary')}
                />
              </div>
              
              <div className="md:col-span-3">
                <TextArea
                  id="permanentAddress"
                  label="Permanent Address"
                  rows={3}
                  error={errors.permanentAddress?.message}
                  {...register('permanentAddress')}
                />
              </div>
              
              <div className="md:col-span-3">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="currentAddress" className="block text-sm font-medium text-gray-700">
                    Current Address
                  </label>
                  <button
                    type="button"
                    onClick={setSameAddress}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Same as permanent address
                  </button>
                </div>
                <TextArea
                  id="currentAddress"
                  rows={3}
                  error={errors.currentAddress?.message}
                  {...register('currentAddress')}
                />
              </div>
              
              <div className="md:col-span-3">
                <FileUpload
                  id="idProof"
                  label="ID Proof Document (PDF only, 10KB - 1MB)"
                  accept="application/pdf"
                  onChange={setIdProofFile}
                  error={!idProofFile ? 'ID proof document is required' : undefined}
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/employees/search')}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                isLoading={loading}
              >
                Add Employee
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAdd;