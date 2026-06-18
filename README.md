# ExtJS to Angular Migration Demo

## Overview

This repository demonstrates a realistic migration path from an ExtJS EnterpriseHR dashboard to a modern Angular application. It keeps the same business domain, sample data, page structure, and user workflows in both versions so the differences between ExtJS and Angular are easy to compare.

The goal is not only to recreate screens visually, but to show how ExtJS concepts such as grids, forms, stores, layouts, and navigation map to Angular components, services, routing, Angular Material, and reactive state.

## Why ExtJS Migration is Complex

- ExtJS applications often combine layout, data binding, component configuration, event handling, and business logic inside large component definitions.
- `Ext.data.Store` can hide important state-management behavior that needs to be redesigned as Angular services, observables, and shared component state.
- ExtJS UI widgets are highly integrated, so replacing grids, forms, dialogs, themes, and charting requires both visual and behavioral migration work.
- Legacy ExtJS apps may rely on global namespaces, mutable records, imperative event handlers, and framework-specific lifecycle patterns that do not translate directly to Angular.

## Project Structure

```text
extjs-to-angular-migration/
  extjs-version/
    index.html
    ...
  angular-version/
    angular.json
    package.json
    src/
      app/
        dashboard/
        employees/
        departments/
        reports/
        services/
        app.component.*
        app.routes.ts
        models.ts
      main.ts
      styles.scss
  README.md
```

- `extjs-version/` contains the original ExtJS EnterpriseHR implementation.
- `angular-version/` contains the migrated Angular 17 standalone application.
- The Angular version keeps the same pages and workflows, but implements them with Angular routing, Angular Material, reactive forms, and shared service-based state.

## Component Mapping Table

| ExtJS Component | Angular Equivalent | Notes |
| --- | --- | --- |
| `Ext.grid.Panel` | Angular Material `mat-table` | Used for Employees, Departments, and Reports tables. |
| `Ext.form.Panel` | Reactive Forms | Add/edit workflows use Angular `FormGroup`, validators, and Material dialogs. |
| `Ext.data.Store` | Angular Service + `BehaviorSubject` | Shared data lives in `EmployeeService` and is consumed by routed components. |
| `Ext.tab.Panel` | `RouterModule` with `RouterLink` | Page switching becomes Angular routing with sidebar navigation. |
| `Ext.button.Button` | Angular Material `mat-button` | Toolbar and dialog actions use Material buttons. |
| ExtJS themes | Angular Material theming + SCSS | Triton styling is replaced with Material components and custom enterprise SCSS. |
| `Ext.chart` | Custom CSS chart / Chart.js | The demo uses a lightweight CSS horizontal bar chart; Chart.js could be introduced for richer analytics. |

## Features Migrated

### Dashboard

- Four stat cards: Total Employees, Active Employees, On Leave, Inactive
- Horizontal department bar chart
- Recent activity panel
- Dark enterprise header with notification bell and user avatar

### Employees

- Employee table with Name, Department, Salary, Status
- Real-time search by name or department
- Status filter: All, Active, Inactive, On Leave
- Colored status badges
- Add, edit, and delete employee workflows
- Angular Material dialog forms with validation

### Departments

- Department table with Department Name, Manager, Employee Count, Budget
- Add, edit, and delete department workflows
- Angular Material dialog forms with validation

### Reports

- Salary summary by department
- Total salary per department
- Average salary per department
- Department filter dropdown

## How to Run ExtJS Version

The ExtJS version is a browser-based HTML app.

1. Open the project in VS Code.
2. Go to:

```text
extjs-version/index.html
```

3. Right-click the file and choose **Open with Live Server**.

You can also open the file directly in a browser, but Live Server is recommended.

## How to Run Angular Version

From the Angular project folder:

```powershell
cd angular-version
npm install
npm start
```

Then open:

```text
http://localhost:4200
```

To create a production build:

```powershell
npm run build
```

## Tech Stack

| Area | ExtJS Version | Angular Version |
| --- | --- | --- |
| Framework | ExtJS 6.x | Angular 17 standalone |
| UI Components | ExtJS Classic toolkit | Angular Material |
| Layout | ExtJS border/card layouts | Angular component shell + CSS grid |
| Navigation | ExtJS component state | Angular Router |
| Tables | `Ext.grid.Panel` | `mat-table` |
| Forms | `Ext.form.Panel` | Reactive Forms |
| Dialogs | ExtJS message/dialog patterns | `MatDialog` |
| State | `Ext.data.Store` | Service + `BehaviorSubject` |
| Styling | Triton theme + custom CSS | Angular Material + SCSS |
| Charts | ExtJS/custom visual chart | Custom CSS chart |

## Key Migration Decisions

- Angular standalone components were used to match modern Angular 17 best practices and reduce NgModule boilerplate.
- `RouterModule` replaced ExtJS-style page switching so each major screen has a clear route and component boundary.
- `EmployeeService` centralizes shared employee and department state, replacing ExtJS stores with observable state.
- `BehaviorSubject` was chosen because it gives every component the current value immediately while still supporting reactive updates.
- Angular Material was selected to replace ExtJS grids, buttons, forms, dialogs, and selects with production-ready Angular UI components.
- Reactive Forms were used for add/edit dialogs because they provide explicit validation, typed form state, and predictable submit behavior.
- The dashboard chart is implemented with CSS to keep the demo lightweight, but the structure allows Chart.js or another Angular chart library to be added later.
