import { AsyncPipe, CurrencyPipe, NgFor } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, FormsModule, MatFormFieldModule, MatSelectModule, MatTableModule, NgFor],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  private readonly employeeService = inject(EmployeeService);

  readonly displayedColumns = ['department', 'employeeCount', 'totalSalary', 'averageSalary'];
  readonly selectedDepartment = signal('All');
  readonly summaries = toSignal(this.employeeService.salarySummary$, { initialValue: [] });
  readonly departments = computed(() => ['All', ...this.summaries().map((row) => row.department).sort()]);
  readonly filteredSummaries = computed(() => {
    const department = this.selectedDepartment();
    return this.summaries().filter((row) => department === 'All' || row.department === department);
  });
}
