import { expect, fixture, html } from '@open-wc/testing';
import '../src/components/employees/table.js';
import { employeeStore } from '../src/services/employee-store.js';
import { createEmployee, mockStore, restoreStore, setupEmptyStore, setupStore } from './test-utils.js';

describe('EmployeesTable', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employees-table></employees-table>`);
    await setupEmptyStore(element);
  });

  it('should render the component', () => {
    expect(element).to.exist;
  });

  describe('empty state', () => {
    it('should display empty state component when no employees', async () => {
      await element.updateComplete;
      const emptyState = element.shadowRoot.querySelector('empty-state');
      expect(emptyState).to.exist;
    });

    it('should render empty state component when no search results', async () => {
      employeeStore.employees = [createEmployee()];
      employeeStore.setSearchQuery('nonexistent');
      await element.updateComplete;

      const emptyState = element.shadowRoot.querySelector('empty-state');
      expect(emptyState).to.exist;
    });

    it('should show table when employees exist', async () => {
      await setupStore(3, element);
      
      const table = element.shadowRoot.querySelector('table');
      const emptyState = element.shadowRoot.querySelector('empty-state');
      
      expect(table).to.exist;
      expect(emptyState).to.not.exist;
    });
  });

  describe('with employee data', () => {
    beforeEach(async () => {
      const employees = [
        createEmployee({ id: '1', firstName: 'John', lastName: 'Doe' }),
        createEmployee({ id: '2', firstName: 'Jane', lastName: 'Smith', department: 'Analytics', position: 'Junior' })
      ];
      await setupStore(employees, element);
    });

    it('should display table with headers', async () => {
      const table = element.shadowRoot.querySelector('table');
      expect(table).to.exist;

      const headers = table.querySelectorAll('thead th');
      expect(headers.length).to.be.greaterThan(5);
    });

    it('should display employee rows', async () => {
      const rows = element.shadowRoot.querySelectorAll('tbody tr');
      expect(rows).to.have.length(2);
    });

    it('should display employee information correctly', async () => {
      const firstRow = element.shadowRoot.querySelector('tbody tr');
      const cells = firstRow.querySelectorAll('td');

      expect(firstRow.textContent).to.include('John');
      expect(firstRow.textContent).to.include('Doe');
    });

    it('should display edit and delete buttons for each employee', async () => {
      const rows = element.shadowRoot.querySelectorAll('tbody tr');

      rows.forEach(row => {
        const editLink = row.querySelector('a[href*="/employee/edit"]');
        const deleteButton = row.querySelector('button');
        expect(editLink).to.exist;
        expect(deleteButton).to.exist;
      });
    });
  });

  describe('selection functionality', () => {
    beforeEach(async () => {
      const employees = [
        createEmployee({ id: '1', firstName: 'John', lastName: 'Doe' }),
        createEmployee({ id: '2', firstName: 'Jane', lastName: 'Smith', department: 'Analytics', position: 'Junior' })
      ];
      await setupStore(employees, element);
    });

    it('should display header checkbox', async () => {
      const headerCheckbox = element.shadowRoot.querySelector('thead app-checkbox');
      expect(headerCheckbox).to.exist;
    });

    it('should display row checkboxes', async () => {
      const rowCheckboxes = element.shadowRoot.querySelectorAll('tbody app-checkbox');
      expect(rowCheckboxes).to.have.length(2);
    });

    it('should handle employee selection toggle', () => {
      const employee = { id: '1' };
      element.handleEmployeeCheckboxChange(employee);
      expect(employeeStore.selectedEmployeeIds.has('1')).to.be.true;

      element.handleEmployeeCheckboxChange(employee);
      expect(employeeStore.selectedEmployeeIds.has('1')).to.be.false;
    });

    it('should handle select all toggle - none selected', () => {
      element.handleHeaderCheckboxChange();
      expect(employeeStore.selectedEmployeeIds.size).to.equal(2);
    });

    it('should handle select all toggle - some selected', () => {
      employeeStore.selectedEmployeeIds.add('1');
      employeeStore.selectedEmployeeIds.add('2');
      element.handleHeaderCheckboxChange();
      expect(employeeStore.selectedEmployeeIds.size).to.equal(0);
    });
  });

  describe('delete functionality', () => {
    beforeEach(async () => {
      await setupStore(1, element);
    });

    it('should handle individual delete', () => {
      const employee = employeeStore.employees[0];
      let eventFired = false;

      element.addEventListener('employee-delete', (e) => {
        eventFired = true;
        expect(e.detail.employee).to.deep.equal(employee);
      });

      element.handleDeleteEmployee(employee);
      expect(eventFired).to.be.true;
    });
  });

  describe('load sample data', () => {
    it('should load sample data when button clicked', () => {
      let seedDataCalled = false;
      const original = mockStore({ seedData: () => { seedDataCalled = true; } });

      element.seedEmployees();

      expect(seedDataCalled).to.be.true;
      restoreStore(original);
    });
  });

  describe('responsive design', () => {
    it('should have responsive CSS with horizontal scroll', () => {
      const styles = element.constructor.styles;
      expect(styles).to.exist;

      const cssText = styles.toString();
      expect(cssText).to.include('overflow-x');
      expect(cssText).to.include('@media');
    });

    it('should have sticky columns for mobile', () => {
      const styles = element.constructor.styles;
      const cssText = styles.toString();
      expect(cssText).to.include('position: sticky');
    });
  });

  describe('event listeners', () => {
    it('should update on employee store changes', async () => {
      const originalRequestUpdate = element.requestUpdate;
      let updateCalled = false;
      element.requestUpdate = () => { updateCalled = true; };

      employeeStore.dispatchEvent(new CustomEvent('employees-changed'));

      expect(updateCalled).to.be.true;
      element.requestUpdate = originalRequestUpdate;
    });
  });
});
