import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Department, DepartmentCount, Employee, SalarySummary } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly employeesSubject = new BehaviorSubject<Employee[]>([
    { id: 1, name: 'Ayesha Khan', department: 'Finance', salary: 82000, status: 'Active' },
    { id: 2, name: 'Daniel Reed', department: 'Engineering', salary: 112000, status: 'Active' },
    { id: 3, name: 'Maria Santos', department: 'Human Resources', salary: 76000, status: 'On Leave' },
    { id: 4, name: 'Omar Farooq', department: 'Operations', salary: 69000, status: 'Active' },
    { id: 5, name: 'Priya Mehta', department: 'Product', salary: 98000, status: 'Inactive' },
    { id: 6, name: 'Nora Ellis', department: 'Sales', salary: 88000, status: 'Active' },
    { id: 7, name: 'Hassan Ali', department: 'Engineering', salary: 105000, status: 'On Leave' },
    { id: 8, name: 'Sofia Chen', department: 'Support', salary: 72000, status: 'Active' }
  ]);

  private readonly departmentsSubject = new BehaviorSubject<Department[]>([
    { id: 1, name: 'Engineering', manager: 'Daniel Reed', employeeCount: 2, budget: 420000 },
    { id: 2, name: 'Finance', manager: 'Ayesha Khan', employeeCount: 1, budget: 210000 },
    { id: 3, name: 'Human Resources', manager: 'Maria Santos', employeeCount: 1, budget: 160000 },
    { id: 4, name: 'Operations', manager: 'Omar Farooq', employeeCount: 1, budget: 185000 },
    { id: 5, name: 'Product', manager: 'Priya Mehta', employeeCount: 1, budget: 245000 },
    { id: 6, name: 'Sales', manager: 'Nora Ellis', employeeCount: 1, budget: 230000 },
    { id: 7, name: 'Support', manager: 'Sofia Chen', employeeCount: 1, budget: 150000 }
  ]);

  readonly employees$ = this.employeesSubject.asObservable();
  readonly departments$ = this.departmentsSubject.asObservable();

  readonly departmentCounts$ = this.employees$.pipe(
    map((employees) => {
      const counts = employees.reduce<Record<string, number>>((result, employee) => {
        result[employee.department] = (result[employee.department] ?? 0) + 1;
        return result;
      }, {});
      const max = Math.max(...Object.values(counts), 1);

      return Object.entries(counts).map(([department, count]): DepartmentCount => ({
        department,
        count,
        percent: Math.max(18, Math.round((count / max) * 100))
      }));
    })
  );

  readonly salarySummary$ = this.employees$.pipe(
    map((employees) => {
      const summary = employees.reduce<Record<string, SalarySummary>>((result, employee) => {
        result[employee.department] ??= {
          department: employee.department,
          employeeCount: 0,
          totalSalary: 0,
          averageSalary: 0
        };
        result[employee.department].employeeCount += 1;
        result[employee.department].totalSalary += employee.salary;
        return result;
      }, {});

      return Object.values(summary).map((row) => ({
        ...row,
        averageSalary: row.totalSalary / row.employeeCount
      }));
    })
  );

  addEmployee(employee: Omit<Employee, 'id'>): void {
    const employees = this.employeesSubject.value;
    const id = Math.max(...employees.map((item) => item.id), 0) + 1;
    this.employeesSubject.next([...employees, { id, ...employee }]);
  }

  updateEmployee(employee: Employee): void {
    this.employeesSubject.next(this.employeesSubject.value.map((item) => item.id === employee.id ? employee : item));
  }

  deleteEmployee(id: number): void {
    this.employeesSubject.next(this.employeesSubject.value.filter((employee) => employee.id !== id));
  }

  addDepartment(department: Omit<Department, 'id'>): void {
    const departments = this.departmentsSubject.value;
    const id = Math.max(...departments.map((item) => item.id), 0) + 1;
    this.departmentsSubject.next([...departments, { id, ...department }]);
  }

  updateDepartment(department: Department): void {
    this.departmentsSubject.next(this.departmentsSubject.value.map((item) => item.id === department.id ? department : item));
  }

  deleteDepartment(id: number): void {
    this.departmentsSubject.next(this.departmentsSubject.value.filter((department) => department.id !== id));
  }
}
