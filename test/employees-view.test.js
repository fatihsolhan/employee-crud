import { expect, fixture, html } from '@open-wc/testing';
import '../src/components/employees/view.js';
import { employeeStore } from '../src/services/employee-store.js';
import { createEmployee, setupEmptyStore, setupStore } from './test-utils.js';

describe('EmployeesView', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employees-view></employees-view>`);
    await setupEmptyStore(element);
  });

  it('should render the component', () => {
    expect(element).to.exist;
  });

  it('should display search input', async () => {
    await element.updateComplete;
    const searchInput = element.shadowRoot.querySelector('app-input');
    expect(searchInput).to.exist;
  });

  it('should display view toggle buttons', async () => {
    await element.updateComplete;
    const viewControls = element.shadowRoot.querySelector('.view-controls');
    const buttons = viewControls.querySelectorAll('app-button');
    expect(buttons).to.have.length(2);
  });

  it('should display table view by default', async () => {
    await element.updateComplete;
    const tableView = element.shadowRoot.querySelector('employees-table');
    expect(tableView).to.exist;
  });

  it('should switch to list view when button clicked', async () => {
    await element.updateComplete;

    element.handleViewModeChange('list');
    await element.requestUpdate();

    const listView = element.shadowRoot.querySelector('employees-list');
    expect(listView).to.exist;
  });

  it('should display pagination', async () => {
    await element.updateComplete;
    const pagination = element.shadowRoot.querySelector('employees-pagination');
    expect(pagination).to.exist;
  });

  describe('search functionality', () => {
    beforeEach(async () => {
      const employees = [
        createEmployee({ id: '1', firstName: 'John', lastName: 'Doe' }),
        createEmployee({ id: '2', firstName: 'Jane', lastName: 'Smith' })
      ];
      await setupStore(employees, element);
    });

    it('should handle search input changes', async () => {
      const searchInput = element.shadowRoot.querySelector('app-input');

      element.handleSearchChange({ detail: { value: 'john' } });

      expect(employeeStore.searchQuery).to.equal('john');
    });

    it('should handle search with target value fallback', async () => {
      element.handleSearchChange({ target: { value: 'jane' } });

      expect(employeeStore.searchQuery).to.equal('jane');
    });
  });

  describe('bulk delete functionality', () => {
    beforeEach(async () => {
      await setupStore(2, element);
      employeeStore.selectedEmployeeIds.add('1');
      employeeStore.selectedEmployeeIds.add('2');
      element.selectedCount = 2;
      await element.updateComplete;
    });

    it('should show delete button when employees selected', async () => {
      await element.updateComplete;
      const deleteButton = element.shadowRoot.querySelector('.delete-btn');
      expect(deleteButton).to.exist;
      expect(deleteButton.textContent).to.include('2');
    });

    it('should handle delete selected employees', () => {
      element.handleDeleteSelected();

      expect(element.deleteEmployeeIds).to.deep.equal(['1', '2']);
      expect(element.showDeleteModal).to.be.true;
    });

    it('should not show delete button when no employees selected', async () => {
      employeeStore.selectedEmployeeIds.clear();
      element.selectedCount = 0;
      await element.updateComplete;

      const deleteButton = element.shadowRoot.querySelector('.delete-btn');
      expect(deleteButton).to.not.exist;
    });
  });

  describe('individual delete functionality', () => {
    it('should handle individual employee delete', () => {
      const employee = createEmployee({ id: '1' });

      element.handleEmployeeDelete(employee);

      expect(element.deleteEmployeeIds).to.deep.equal(['1']);
      expect(element.showDeleteModal).to.be.true;
    });
  });

  describe('delete modal', () => {
    it('should display delete modal when showDeleteModal is true', async () => {
      element.showDeleteModal = true;
      element.deleteEmployeeIds = ['1'];
      await element.updateComplete;

      const deleteModal = element.shadowRoot.querySelector('delete-employees');
      expect(deleteModal).to.exist;
      expect(deleteModal.open).to.be.true;
    });

    it('should handle delete modal close', () => {
      element.showDeleteModal = true;
      element.deleteEmployeeIds = ['1'];

      element.handleDeleteClosed();

      expect(element.showDeleteModal).to.be.false;
      expect(element.deleteEmployeeIds).to.deep.equal([]);
    });
  });

  describe('responsive design', () => {
    it('should have responsive CSS', () => {
      const styles = element.constructor.styles;
      expect(styles).to.exist;

      const cssText = styles.toString();
      expect(cssText).to.include('@media');
    });
  });

  describe('event listeners', () => {
    it('should update on store changes', async () => {
      const originalRequestUpdate = element.requestUpdate;
      let updateCalled = false;
      element.requestUpdate = () => { updateCalled = true; };

      employeeStore.dispatchEvent(new CustomEvent('employees-changed'));

      expect(updateCalled).to.be.true;
      element.requestUpdate = originalRequestUpdate;
    });
  });
});
