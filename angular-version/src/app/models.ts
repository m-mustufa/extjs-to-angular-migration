export type EmployeeStatus = 'Active' | 'On Leave' | 'Inactive';

export interface Employee {
  id: number;
  name: string;
  department: string;
  salary: number;
  status: EmployeeStatus;
}

export interface Department {
  id: number;
  name: string;
  manager: string;
  employeeCount: number;
  budget: number;
}

export interface SalarySummary {
  department: string;
  employeeCount: number;
  totalSalary: number;
  averageSalary: number;
}

export interface DepartmentCount {
  department: string;
  count: number;
  percent: number;
}
