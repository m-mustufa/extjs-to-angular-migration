(function () {
  'use strict';

  if (!window.Ext) {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.innerHTML = [
        '<div class="cdn-error">',
        '<h1>ExtJS could not be loaded</h1>',
        '<p>Please check your internet connection and confirm the CDN scripts are not blocked by the browser or network.</p>',
        '</div>'
      ].join('');
    });

    return;
  }

  Ext.define('EmployeeManagement.model.Employee', {
    extend: 'Ext.data.Model',
    fields: [
      { name: 'id', type: 'int' },
      { name: 'name', type: 'string' },
      { name: 'department', type: 'string' },
      { name: 'salary', type: 'float' },
      { name: 'status', type: 'string' }
    ]
  });

  Ext.define('EmployeeManagement.store.Employees', {
    extend: 'Ext.data.Store',
    alias: 'store.employees',
    model: 'EmployeeManagement.model.Employee',
    data: [
      { id: 1, name: 'Ayesha Khan', department: 'Finance', salary: 82000, status: 'Active' },
      { id: 2, name: 'Daniel Reed', department: 'Engineering', salary: 112000, status: 'Active' },
      { id: 3, name: 'Maria Santos', department: 'Human Resources', salary: 76000, status: 'On Leave' },
      { id: 4, name: 'Omar Farooq', department: 'Operations', salary: 69000, status: 'Active' },
      { id: 5, name: 'Priya Mehta', department: 'Product', salary: 98000, status: 'Inactive' }
    ]
  });

  Ext.define('EmployeeManagement.view.EmployeeForm', {
    extend: 'Ext.form.Panel',
    xtype: 'employeeform',

    title: 'Add Employee',
    region: 'east',
    width: 360,
    minWidth: 320,
    split: true,
    bodyPadding: 18,
    collapsible: true,
    defaultType: 'textfield',

    defaults: {
      anchor: '100%',
      labelAlign: 'top',
      allowBlank: false,
      msgTarget: 'side'
    },

    items: [
      {
        xtype: 'hiddenfield',
        name: 'id',
        allowBlank: true
      },
      {
        fieldLabel: 'Name',
        name: 'name',
        emptyText: 'Employee full name'
      },
      {
        xtype: 'combo',
        fieldLabel: 'Department',
        name: 'department',
        emptyText: 'Select department',
        editable: false,
        forceSelection: true,
        queryMode: 'local',
        store: ['Engineering', 'Finance', 'Human Resources', 'Operations', 'Product', 'Sales', 'Support']
      },
      {
        xtype: 'numberfield',
        fieldLabel: 'Salary',
        name: 'salary',
        minValue: 0,
        step: 1000,
        hideTrigger: false,
        emptyText: 'Annual salary'
      },
      {
        xtype: 'combo',
        fieldLabel: 'Status',
        name: 'status',
        editable: false,
        forceSelection: true,
        queryMode: 'local',
        store: ['Active', 'On Leave', 'Inactive'],
        value: 'Active'
      }
    ],

    buttons: [
      {
        text: 'Save',
        ui: 'soft-green',
        itemId: 'saveEmployeeButton'
      },
      {
        text: 'Cancel',
        itemId: 'cancelEmployeeButton'
      }
    ]
  });

  Ext.define('EmployeeManagement.view.EmployeeGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'employeegrid',

    title: 'Employee Directory',
    region: 'center',
    columnLines: true,

    selModel: {
      selType: 'rowmodel',
      mode: 'SINGLE'
    },

    tbar: [
      {
        text: 'Add',
        iconCls: 'x-fa fa-plus',
        itemId: 'addEmployeeButton'
      },
      {
        text: 'Edit',
        iconCls: 'x-fa fa-pencil',
        itemId: 'editEmployeeButton'
      },
      {
        text: 'Delete',
        iconCls: 'x-fa fa-trash',
        itemId: 'deleteEmployeeButton'
      }
    ],

    columns: [
      {
        text: 'Name',
        dataIndex: 'name',
        flex: 1.4,
        minWidth: 180
      },
      {
        text: 'Department',
        dataIndex: 'department',
        flex: 1,
        minWidth: 150
      },
      {
        text: 'Salary',
        dataIndex: 'salary',
        width: 130,
        align: 'right',
        renderer: Ext.util.Format.usMoney
      },
      {
        text: 'Status',
        dataIndex: 'status',
        width: 120,
        align: 'center',
        renderer: function (value) {
          var className = value === 'Active' ? 'status-active' : value === 'On Leave' ? 'status-on-leave' : 'status-inactive';

          return '<span class="status-pill ' + className + '">' + Ext.String.htmlEncode(value) + '</span>';
        }
      }
    ]
  });

  Ext.define('EmployeeManagement.view.Main', {
    extend: 'Ext.container.Viewport',
    xtype: 'app-main',

    cls: 'app-shell',
    layout: 'border',

    items: [
      {
        xtype: 'container',
        region: 'north',
        cls: 'app-header',
        height: 92,
        html: [
          '<div class="app-title">Employee Management</div>',
          '<div class="app-subtitle">Maintain employee records, compensation, departments, and current employment status.</div>'
        ].join('')
      },
      {
        xtype: 'panel',
        region: 'center',
        cls: 'app-workspace',
        layout: 'border',
        bodyPadding: 16,
        border: false,
        items: [
          {
            xtype: 'employeegrid',
            itemId: 'employeeGrid'
          },
          {
            xtype: 'employeeform',
            itemId: 'employeeForm'
          }
        ]
      }
    ]
  });

  Ext.application({
    name: 'EmployeeManagement',

    launch: function () {
      var employeeStore = Ext.create('EmployeeManagement.store.Employees');
      var nextEmployeeId = employeeStore.max('id') + 1;
      var editingRecord = null;
      var viewport = Ext.create('EmployeeManagement.view.Main');
      var grid = viewport.down('#employeeGrid');
      var formPanel = viewport.down('#employeeForm');

      function clearForm() {
        editingRecord = null;
        formPanel.getForm().reset();
        formPanel.setTitle('Add Employee');
        grid.getSelectionModel().deselectAll();
      }

      function getSelectedRecord(action) {
        var record = grid.getSelectionModel().getSelection()[0];

        if (!record) {
          Ext.Msg.alert('No Employee Selected', 'Please select an employee to ' + action + '.');
          return null;
        }

        return record;
      }

      function loadSelectedEmployee() {
        var record = getSelectedRecord('edit');

        if (!record) {
          return;
        }

        editingRecord = record;
        formPanel.setTitle('Edit Employee');
        formPanel.getForm().loadRecord(record);
      }

      function deleteSelectedEmployee() {
        var record = getSelectedRecord('delete');

        if (!record) {
          return;
        }

        Ext.Msg.confirm('Delete Employee', 'Delete ' + record.get('name') + ' from the employee list?', function (choice) {
          if (choice === 'yes') {
            employeeStore.remove(record);
            clearForm();
          }
        });
      }

      function saveEmployee() {
        var form = formPanel.getForm();
        var values;

        if (!form.isValid()) {
          return;
        }

        values = form.getValues();
        values.salary = parseFloat(values.salary);

        if (editingRecord) {
          editingRecord.set(values);
          editingRecord.commit();
        } else {
          values.id = nextEmployeeId++;
          employeeStore.add(values);
        }

        clearForm();
      }

      grid.setStore(employeeStore);
      grid.down('#addEmployeeButton').on('click', clearForm);
      grid.down('#editEmployeeButton').on('click', loadSelectedEmployee);
      grid.down('#deleteEmployeeButton').on('click', deleteSelectedEmployee);
      grid.on('itemdblclick', loadSelectedEmployee);
      formPanel.down('#saveEmployeeButton').on('click', saveEmployee);
      formPanel.down('#cancelEmployeeButton').on('click', clearForm);
    }
  });
}());
