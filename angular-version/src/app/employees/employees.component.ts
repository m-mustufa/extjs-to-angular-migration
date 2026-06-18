import { CurrencyPipe, NgClass, NgFor } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Employee, EmployeeStatus } from '../models';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    NgClass,
    NgFor,
    ReactiveFormsModule
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {
  private readonly employeeService = inject(EmployeeService);
  private readonly dialog = inject(MatDialog);

  readonly displayedColumns = ['name', 'department', 'salary', 'status'];
  readonly statuses: Array<EmployeeStatus | 'All'> = ['All', 'Active', 'Inactive', 'On Leave'];
  readonly searchTerm = signal('');
  readonly statusFilter = signal<EmployeeStatus | 'All'>('All');
  readonly selectedEmployee = signal<Employee | null>(null);
  readonly employees = toSignal(this.employeeService.employees$, { initialValue: [] });

  filteredEmployees(): Employee[] {
    const search = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.employees().filter((employee) => {
      const matchesSearch = !search || employee.name.toLowerCase().includes(search) || employee.department.toLowerCase().includes(search);
      const matchesStatus = status === 'All' || employee.status === status;
      return matchesSearch && matchesStatus;
    });
  }

  statusClass(status: EmployeeStatus): string {
    return status === 'Active' ? 'active' : status === 'On Leave' ? 'on-leave' : 'inactive';
  }

  addEmployee(): void {
    const ref = this.dialog.open(EmployeeDialogComponent, {
      width: '460px',
      data: null
    });

    ref.afterClosed().subscribe((result: Omit<Employee, 'id'> | undefined) => {
      if (result) {
        this.employeeService.addEmployee(result);
      }
    });
  }

  editEmployee(): void {
    const employee = this.selectedEmployee();

    if (!employee) {
      alert('Please select an employee to edit.');
      return;
    }

    const ref = this.dialog.open(EmployeeDialogComponent, {
      width: '460px',
      data: employee
    });

    ref.afterClosed().subscribe((result: Employee | undefined) => {
      if (result) {
        this.employeeService.updateEmployee(result);
      }
    });
  }

  deleteEmployee(): void {
    const employee = this.selectedEmployee();

    if (!employee) {
      alert('Please select an employee to delete.');
      return;
    }

    if (confirm(`Delete ${employee.name} from the employee list?`)) {
      this.employeeService.deleteEmployee(employee.id);
      this.selectedEmployee.set(null);
    }
  }
}

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, NgFor, ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Employee' : 'Add Employee' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content>
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Employee full name">
          <mat-error>Name is required.</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Department</mat-label>
          <mat-select formControlName="department">
            <mat-option *ngFor="let department of departments" [value]="department">{{ department }}</mat-option>
          </mat-select>
          <mat-error>Department is required.</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Salary</mat-label>
          <input matInput type="number" formControlName="salary" placeholder="Annual salary">
          <mat-error>Salary is required.</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option *ngFor="let status of statuses" [value]="status">{{ status }}</mat-option>
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancel</button>
        <button mat-flat-button color="primary" type="submit">{{ data ? 'Save Changes' : 'Add Employee' }}</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    mat-dialog-content {
      display: grid;
      gap: 12px;
      padding-top: 8px;
    }

    mat-form-field {
      width: 100%;
    }
  `]
})
export class EmployeeDialogComponent {
  readonly data = inject<Employee | null>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<EmployeeDialogComponent>);
  private readonly formBuilder = inject(FormBuilder);

  readonly departments = ['Engineering', 'Finance', 'Human Resources', 'Operations', 'Product', 'Sales', 'Support'];
  readonly statuses: EmployeeStatus[] = ['Active', 'On Leave', 'Inactive'];

  readonly form = this.formBuilder.nonNullable.group({
    name: [this.data?.name ?? '', Validators.required],
    department: [this.data?.department ?? '', Validators.required],
    salary: [this.data?.salary ?? 0, [Validators.required, Validators.min(0)]],
    status: [this.data?.status ?? 'Active' as EmployeeStatus, Validators.required]
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      ...this.data,
      ...this.form.getRawValue()
    });
  }
}
