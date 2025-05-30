import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Employee, EmployeeSearchFilters, SearchResult, Department, PaginationState } from '../types';
import { 
  getEmployees, 
  addEmployee, 
  updateEmployee, 
  deleteEmployee, 
  generateEmployeeId, 
  generateLoginId 
} from '../services/employeeService';

interface EmployeeContextType {
  employees: Employee[];
  searchResults: SearchResult;
  selectedEmployees: string[];
  loading: boolean;
  error: string | null;
  searchEmployees: (filters: EmployeeSearchFilters, pagination: PaginationState) => Promise<void>;
  addNewEmployee: (employee: Omit<Employee, 'id' | 'loginId' | 'createdAt' | 'updatedAt'>) => Promise<Employee>;
  updateExistingEmployee: (id: string, employee: Partial<Employee>) => Promise<Employee>;
  deleteSelectedEmployees: () => Promise<void>;
  deleteEmployeeById: (id: string) => Promise<void>;
  getEmployeeById: (id: string) => Employee | undefined;
  toggleEmployeeSelection: (id: string) => void;
  clearSelectedEmployees: () => void;
  generateId: () => string;
  generateLogin: (firstName: string, lastName: string) => Promise<string>;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult>({
    employees: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  });
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchEmployees = useCallback(async (filters: EmployeeSearchFilters, pagination: PaginationState) => {
    try {
      setLoading(true);
      setError(null);
      const results = await getEmployees(filters, pagination);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to fetch employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNewEmployee = useCallback(async (employeeData: Omit<Employee, 'id' | 'loginId' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate ID and login ID
      const id = generateEmployeeId();
      const loginId = await generateLoginId(employeeData.firstName, employeeData.lastName);
      
      const newEmployee: Employee = {
        ...employeeData,
        id,
        loginId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const added = await addEmployee(newEmployee);
      setEmployees(prev => [...prev, added]);
      return added;
    } catch (err) {
      setError('Failed to add employee');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExistingEmployee = useCallback(async (id: string, employeeData: Partial<Employee>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updated = await updateEmployee(id, employeeData);
      
      setEmployees(prev => 
        prev.map(emp => emp.id === id ? { ...emp, ...updated } : emp)
      );
      
      setSearchResults(prev => ({
        ...prev,
        employees: prev.employees.map(emp => 
          emp.id === id ? { ...emp, ...updated } : emp
        )
      }));
      
      return updated;
    } catch (err) {
      setError('Failed to update employee');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEmployeeById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await deleteEmployee(id);
      
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      setSearchResults(prev => ({
        ...prev,
        employees: prev.employees.filter(emp => emp.id !== id),
        pagination: {
          ...prev.pagination,
          total: prev.pagination.total - 1
        }
      }));
      
      // Remove from selected if present
      setSelectedEmployees(prev => prev.filter(empId => empId !== id));
    } catch (err) {
      setError('Failed to delete employee');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSelectedEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Delete all selected employees
      await Promise.all(selectedEmployees.map(id => deleteEmployee(id)));
      
      // Update local state
      setEmployees(prev => prev.filter(emp => !selectedEmployees.includes(emp.id)));
      setSearchResults(prev => ({
        ...prev,
        employees: prev.employees.filter(emp => !selectedEmployees.includes(emp.id)),
        pagination: {
          ...prev.pagination,
          total: prev.pagination.total - selectedEmployees.length
        }
      }));
      
      // Clear selection
      setSelectedEmployees([]);
    } catch (err) {
      setError('Failed to delete selected employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedEmployees]);

  const getEmployeeById = useCallback((id: string) => {
    return employees.find(emp => emp.id === id) || 
           searchResults.employees.find(emp => emp.id === id);
  }, [employees, searchResults.employees]);

  const toggleEmployeeSelection = useCallback((id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) 
        ? prev.filter(empId => empId !== id)
        : [...prev, id]
    );
  }, []);

  const clearSelectedEmployees = useCallback(() => {
    setSelectedEmployees([]);
  }, []);

  const generateId = useCallback(() => {
    return generateEmployeeId();
  }, []);

  const generateLogin = useCallback(async (firstName: string, lastName: string) => {
    return generateLoginId(firstName, lastName);
  }, []);

  const value = {
    employees,
    searchResults,
    selectedEmployees,
    loading,
    error,
    searchEmployees,
    addNewEmployee,
    updateExistingEmployee,
    deleteSelectedEmployees,
    deleteEmployeeById,
    getEmployeeById,
    toggleEmployeeSelection,
    clearSelectedEmployees,
    generateId,
    generateLogin
  };

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
};

export const useEmployees = (): EmployeeContextType => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};