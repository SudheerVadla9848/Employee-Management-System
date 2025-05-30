import { nanoid } from 'nanoid';
import { 
  Employee, 
  EmployeeSearchFilters, 
  SearchResult, 
  PaginationState,
  Department 
} from '../types';

// Mock employee data
let MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP00001',
    firstName: 'John',
    lastName: 'Doe',
    middleName: '',
    loginId: 'jdoe',
    dateOfBirth: new Date('1990-05-15'),
    department: Department.Engineering,
    salary: 85000,
    permanentAddress: '123 Main St, Anytown, USA',
    currentAddress: '123 Main St, Anytown, USA',
    idProofUrl: 'https://example.com/idproof/jdoe.pdf',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'EMP00002',
    firstName: 'Jane',
    lastName: 'Smith',
    middleName: 'Marie',
    loginId: 'jsmith',
    dateOfBirth: new Date('1988-09-23'),
    department: Department.HR,
    salary: 75000,
    permanentAddress: '456 Oak Ave, Somewhere, USA',
    currentAddress: '789 Pine Blvd, Elsewhere, USA',
    idProofUrl: 'https://example.com/idproof/jsmith.pdf',
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-02-10')
  },
  {
    id: 'EMP00003',
    firstName: 'Michael',
    lastName: 'Johnson',
    middleName: 'David',
    loginId: 'mjohnson',
    dateOfBirth: new Date('1992-11-08'),
    department: Department.Finance,
    salary: 90000,
    permanentAddress: '101 Elm St, Nowhere, USA',
    currentAddress: '101 Elm St, Nowhere, USA',
    idProofUrl: 'https://example.com/idproof/mjohnson.pdf',
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-03-05')
  }
];

/**
 * Generate a unique employee ID
 */
export const generateEmployeeId = (): string => {
  // Find the highest current ID number
  const highestId = MOCK_EMPLOYEES.reduce((max, emp) => {
    const idNum = parseInt(emp.id.replace('EMP', ''), 10);
    return idNum > max ? idNum : max;
  }, 0);
  
  // Format: EMPXXXXX (with leading zeros)
  return `EMP${String(highestId + 1).padStart(5, '0')}`;
};

/**
 * Generate a unique login ID based on first and last name
 */
export const generateLoginId = async (firstName: string, lastName: string): Promise<string> => {
  // Base login ID: first letter of first name + last name, all lowercase
  const baseLoginId = (firstName.charAt(0) + lastName).toLowerCase();
  
  // Check if the login ID already exists
  const exists = MOCK_EMPLOYEES.some(emp => emp.loginId === baseLoginId);
  
  if (!exists) {
    return baseLoginId;
  }
  
  // If exists, append random numbers until unique
  let uniqueLoginId = '';
  let isUnique = false;
  
  while (!isUnique) {
    // Generate a 3-digit random number
    const randomNum = Math.floor(Math.random() * 900) + 100; // 100-999
    uniqueLoginId = `${baseLoginId}${randomNum}`;
    
    // Check if this version is unique
    isUnique = !MOCK_EMPLOYEES.some(emp => emp.loginId === uniqueLoginId);
  }
  
  return uniqueLoginId;
};

/**
 * Fetch employees with filtering and pagination
 */
export const getEmployees = async (
  filters: EmployeeSearchFilters, 
  pagination: PaginationState
): Promise<SearchResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Apply filters
  let filteredEmployees = [...MOCK_EMPLOYEES];
  
  if (filters.id) {
    filteredEmployees = filteredEmployees.filter(emp => 
      emp.id.toLowerCase().includes(filters.id!.toLowerCase())
    );
  }
  
  if (filters.firstName) {
    filteredEmployees = filteredEmployees.filter(emp => 
      emp.firstName.toLowerCase().includes(filters.firstName!.toLowerCase())
    );
  }
  
  if (filters.lastName) {
    filteredEmployees = filteredEmployees.filter(emp => 
      emp.lastName.toLowerCase().includes(filters.lastName!.toLowerCase())
    );
  }
  
  if (filters.loginId) {
    filteredEmployees = filteredEmployees.filter(emp => 
      emp.loginId.toLowerCase().includes(filters.loginId!.toLowerCase())
    );
  }
  
  if (filters.department) {
    filteredEmployees = filteredEmployees.filter(emp => 
      emp.department === filters.department
    );
  }
  
  if (filters.dobStart) {
    filteredEmployees = filteredEmployees.filter(emp => 
      emp.dateOfBirth >= filters.dobStart!
    );
  }
  
  if (filters.dobEnd) {
    filteredEmployees = filteredEmployees.filter(emp => 
      emp.dateOfBirth <= filters.dobEnd!
    );
  }
  
  // Get total count before pagination
  const total = filteredEmployees.length;
  
  // Apply pagination
  const { page, limit } = pagination;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedEmployees = filteredEmployees.slice(start, end);
  
  return {
    employees: paginatedEmployees,
    pagination: {
      page,
      limit,
      total
    }
  };
};

/**
 * Add a new employee
 */
export const addEmployee = async (employee: Employee): Promise<Employee> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Add to mock data
  MOCK_EMPLOYEES.push(employee);
  
  return employee;
};

/**
 * Update an existing employee
 */
export const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Find the employee
  const index = MOCK_EMPLOYEES.findIndex(emp => emp.id === id);
  
  if (index === -1) {
    throw new Error('Employee not found');
  }
  
  // Update the employee
  const updatedEmployee = {
    ...MOCK_EMPLOYEES[index],
    ...employeeData,
    updatedAt: new Date()
  };
  
  MOCK_EMPLOYEES[index] = updatedEmployee;
  
  return updatedEmployee;
};

/**
 * Delete an employee
 */
export const deleteEmployee = async (id: string): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Remove from mock data
  MOCK_EMPLOYEES = MOCK_EMPLOYEES.filter(emp => emp.id !== id);
};

/**
 * Get a single employee by ID
 */
export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const employee = MOCK_EMPLOYEES.find(emp => emp.id === id);
  
  return employee || null;
};