import { expect, fixture, html } from '@open-wc/testing';
import '../src/components/employees/list.js';
import { employeeStore } from '../src/services/employee-store.js';
import { createEmployee, mockStore, restoreStore, setupEmptyStore, setupStore } from './test-utils.js';

describe('EmployeesList', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employees-list></employees-list>`);
    await setupEmptyStore(element);
  });

  it('should render the component', () => {
    expect(element).to.exist;
  });

  describe('empty state', () => {
    it('should display empty state when no employees', async () => {
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

    it('should show list container when employees exist', async () => {
      await setupStore(3, element);
      
      const listContainer = element.shadowRoot.querySelector('.list-container');
      const emptyState = element.shadowRoot.querySelector('empty-state');
      
      expect(listContainer).to.exist;
      expect(emptyState).to.not.exist;
    });
  });

  describe('with employee data', () => {
    beforeEach(async () => {
      await setupStore(5, element);
    });

    it('should display list container', async () => {
      const listContainer = element.shadowRoot.querySelector('.list-container');
      expect(listContainer).to.exist;
    });

    it('should display employee cards', async () => {
      const cards = element.shadowRoot.querySelectorAll('.employee-card');
      expect(cards).to.have.length(5);
    });

    it('should display employee information in cards', async () => {
      const firstCard = element.shadowRoot.querySelector('.employee-card');

      expect(firstCard.textContent).to.include('Employee1');
      expect(firstCard.textContent).to.include('Test');
      expect(firstCard.textContent).to.include('Tech');
      expect(firstCard.textContent).to.include('Senior');
    });

    it('should display selection checkboxes in cards', async () => {
      const checkboxes = element.shadowRoot.querySelectorAll('.employee-card app-checkbox');
      expect(checkboxes).to.have.length(5);
    });

    it('should display action buttons in cards', async () => {
      const cards = element.shadowRoot.querySelectorAll('.employee-card');

      cards.forEach(card => {
        const editLink = card.querySelector('a[href*="/employee/edit"]');
        const deleteButton = card.querySelector('button');
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

    it('should display select all when employees are available', async () => {
      const selectAllButton = element.shadowRoot.querySelector('.list-header app-button');
      expect(selectAllButton).to.exist;
    });

    it('should handle employee selection', () => {
      const employee = { id: '1' };
      element.handleEmployeeCheckboxChange(employee);
      expect(employeeStore.selectedEmployeeIds.has('1')).to.be.true;
    });

    it('should handle select all visible', () => {
      element.handleSelectAll();
      expect(employeeStore.selectedEmployeeIds.size).to.equal(2);
    });

    it('should handle deselect all', () => {
      employeeStore.selectedEmployeeIds.add('1');
      employeeStore.selectedEmployeeIds.add('2');

      element.handleSelectAll();
      expect(employeeStore.selectedEmployeeIds.size).to.equal(0);
    });
  });

  describe('delete functionality', () => {
    beforeEach(async () => {
      await setupStore(5, element);
    });

    it('should handle individual employee delete', () => {
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


  describe('responsive design', () => {
    it('should have responsive grid layout', () => {
      const styles = element.constructor.styles;
      expect(styles).to.exist;

      const cssText = styles.toString();
      expect(cssText).to.include('grid-template-columns');
      expect(cssText).to.include('@media');
    });

    it('should have proper card layout for mobile', () => {
      const styles = element.constructor.styles;
      const cssText = styles.toString();
      expect(cssText).to.include('flex-direction: column');
    });
  });

  describe('date formatting', () => {
    beforeEach(async () => {
      await setupStore(5, element);
    });

    it('should format dates correctly', async () => {
      const card = element.shadowRoot.querySelector('.employee-card');
      expect(card).to.exist;
      expect(card.textContent).to.not.include('Invalid Date');
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
