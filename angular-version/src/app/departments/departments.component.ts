import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Department } from '../models';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CurrencyPipe, MatButtonModule, MatDialogModule, MatTableModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent {
  private readonly employeeService = inject(EmployeeService);
  private readonly dialog = inject(MatDialog);

  readonly displayedColumns = ['name', 'manager', 'employeeCount', 'budget'];
  readonly departments = toSignal(this.employeeService.departments$, { initialValue: [] });
  readonly selectedDepartment = signal<Department | null>(null);

  addDepartment(): void {
    const ref = this.dialog.open(DepartmentDialogComponent, {
      width: '460px',
      data: null
    });

    ref.afterClosed().subscribe((result: Omit<Department, 'id'> | undefined) => {
      if (result) {
        this.employeeService.addDepartment(result);
      }
    });
  }

  editDepartment(): void {
    const department = this.selectedDepartment();

    if (!department) {
      alert('Please select a department to edit.');
      return;
    }

    const ref = this.dialog.open(DepartmentDialogComponent, {
      width: '460px',
      data: department
    });

    ref.afterClosed().subscribe((result: Department | undefined) => {
      if (result) {
        this.employeeService.updateDepartment(result);
      }
    });
  }

  deleteDepartment(): void {
    const department = this.selectedDepartment();

    if (!department) {
      alert('Please select a department to delete.');
      return;
    }

    if (confirm(`Delete ${department.name} from departments?`)) {
      this.employeeService.deleteDepartment(department.id);
      this.selectedDepartment.set(null);
    }
  }
}

@Component({
  selector: 'app-department-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Department' : 'Add Department' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content>
        <mat-form-field appearance="outline">
          <mat-label>Department Name</mat-label>
          <input matInput formControlName="name" placeholder="Department name">
          <mat-error>Department name is required.</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Manager</mat-label>
          <input matInput formControlName="manager" placeholder="Manager name">
          <mat-error>Manager is required.</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Employee Count</mat-label>
          <input matInput type="number" formControlName="employeeCount">
          <mat-error>Employee count is required.</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Budget</mat-label>
          <input matInput type="number" formControlName="budget">
          <mat-error>Budget is required.</mat-error>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancel</button>
        <button mat-flat-button color="primary" type="submit">{{ data ? 'Save Changes' : 'Add Department' }}</button>
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
export class DepartmentDialogComponent {
  readonly data = inject<Department | null>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DepartmentDialogComponent>);
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    name: [this.data?.name ?? '', Validators.required],
    manager: [this.data?.manager ?? '', Validators.required],
    employeeCount: [this.data?.employeeCount ?? 0, [Validators.required, Validators.min(0)]],
    budget: [this.data?.budget ?? 0, [Validators.required, Validators.min(0)]]
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
