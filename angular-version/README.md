# EnterpriseHR Angular 17 Standalone App

This folder contains a proper Angular 17 standalone application that migrates the ExtJS EnterpriseHR dashboard into Angular architecture.

## Architecture

- Angular CLI project structure with `angular.json`
- Standalone bootstrap in `src/main.ts`
- Routing in `src/app/app.routes.ts`
- Dark shell layout in `AppComponent`
- Shared `EmployeeService` using `BehaviorSubject` for employees and departments
- Angular Material tables, dialogs, form fields, selects, buttons, and icons
- Reactive Forms for add/edit dialogs

## Components

| ExtJS area | Angular implementation |
| --- | --- |
| Viewport / shell | `AppComponent` |
| Dashboard page | `DashboardComponent` |
| Employee grid and form | `EmployeesComponent` + `EmployeeDialogComponent` |
| Department grid and form | `DepartmentsComponent` + `DepartmentDialogComponent` |
| Reports grid | `ReportsComponent` |
| ExtJS Store | `EmployeeService` with `BehaviorSubject` |
| Toolbar filters | Signals + Material form fields |
| Add/Edit forms | `MatDialog` + Reactive Forms |
| Sidebar navigation | Router links + `RouterLinkActive` |

## Run

Install dependencies:

```bash
npm install
```

Start the Angular dev server:

```bash
npm start
```

Then open:

```text
http://localhost:4200
```

Build:

```bash
npm run build
```
