import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeesComponent } from './employees/employees.component';
import { DepartmentsComponent } from './departments/departments.component';
import { ReportsComponent } from './reports/reports.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
  { path: 'employees', component: EmployeesComponent, title: 'Employees' },
  { path: 'departments', component: DepartmentsComponent, title: 'Departments' },
  { path: 'reports', component: ReportsComponent, title: 'Reports' },
  { path: '**', redirectTo: 'dashboard' }
];
