import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly employeeService = inject(EmployeeService);

  readonly employees$ = this.employeeService.employees$;
  readonly stats$ = this.employees$.pipe(
    map((employees) => ({
      total: employees.length,
      active: employees.filter((employee) => employee.status === 'Active').length,
      onLeave: employees.filter((employee) => employee.status === 'On Leave').length,
      inactive: employees.filter((employee) => employee.status === 'Inactive').length
    }))
  );
  readonly departmentCounts$ = this.employeeService.departmentCounts$;

  readonly activities = [
    { color: 'blue', title: 'Ayesha Khan updated payroll projections', meta: 'Finance - Today, 10:42 AM' },
    { color: 'orange', title: 'Hassan Ali moved to On Leave', meta: 'Engineering - Yesterday, 4:18 PM' },
    { color: 'green', title: 'Support headcount review completed', meta: 'Support - Jun 16, 2026' },
    { color: 'gray', title: 'Product budget submitted for approval', meta: 'Product - Jun 14, 2026' }
  ];
}
