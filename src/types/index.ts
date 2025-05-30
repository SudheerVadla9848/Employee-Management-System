export interface User {
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  loginId: string;
  dateOfBirth: Date;
  department: Department;
  salary: number;
  permanentAddress: string;
  currentAddress: string;
  idProofFile?: File | null;
  idProofUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum Department {
  Engineering = 'Engineering',
  Support = 'Support',
  HR = 'HR',
  Finance = 'Finance',
}

export interface EmployeeSearchFilters {
  id?: string;
  firstName?: string;
  lastName?: string;
  loginId?: string;
  dobStart?: Date | null;
  dobEnd?: Date | null;
  department?: Department | '';
}

export interface Credentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export interface SearchResult {
  employees: Employee[];
  pagination: PaginationState;
}