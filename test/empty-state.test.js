import { expect, fixture, html } from '@open-wc/testing';
import '../src/components/ui/empty-state.js';
import { employeeStore } from '../src/services/employee-store.js';
import { createEmployee, setupEmptyStore } from './test-utils.js';

describe('EmptyState', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<empty-state></empty-state>`);
    await setupEmptyStore();
    await element.updateComplete;
  });

  it('should render the component', () => {
    expect(element).to.exist;
  });

  it('should display correct content structure', async () => {
    await element.updateComplete;

    const content = element.shadowRoot.querySelector('.empty-state-content');
    const title = element.shadowRoot.querySelector('.empty-state-title');
    const description = element.shadowRoot.querySelector('.empty-state-description');
    const actions = element.shadowRoot.querySelector('.empty-state-actions');

    expect(content).to.exist;
    expect(title).to.exist;
    expect(description).to.exist;
    expect(actions).to.exist;
  });

  describe('when no employees exist', () => {
    beforeEach(async () => {
      await setupEmptyStore();
      await element.updateComplete;
    });

    it('should show "No employees yet" title', async () => {
      const title = element.shadowRoot.querySelector('.empty-state-title');
      expect(title.textContent.trim()).to.include('No employees yet');
    });

    it('should show get started message', async () => {
      const description = element.shadowRoot.querySelector('.empty-state-description');
      expect(description.textContent.trim()).to.include('Get started by adding');
    });

    it('should show both Add Employee and Load Sample Data buttons', async () => {
      const addButton = element.shadowRoot.querySelector('a[href="/employee/add"] app-button');
      const sampleButton = element.shadowRoot.querySelector('app-button[variant="outline"]');

      expect(addButton).to.exist;
      expect(sampleButton).to.exist;
      expect(sampleButton.textContent.trim()).to.include('Load Sample Data');
    });

    it('should load sample data when Load Sample Data button is clicked', async () => {
      const sampleButton = element.shadowRoot.querySelector('app-button[variant="outline"]');

      expect(employeeStore.getAllEmployees()).to.have.length(0);

      sampleButton.click();
      await element.updateComplete;

      expect(employeeStore.getAllEmployees().length).to.be.greaterThan(0);
    });
  });

  describe('when employees exist but search returns no results', () => {
    beforeEach(async () => {
      employeeStore.employees = [createEmployee()];
      employeeStore.setSearchQuery('nonexistent');
      await element.updateComplete;
    });

    it('should show "No employees found" title', async () => {
      const title = element.shadowRoot.querySelector('.empty-state-title');
      expect(title.textContent.trim()).to.include('No employees found');
    });

    it('should show search adjustment message', async () => {
      const description = element.shadowRoot.querySelector('.empty-state-description');
      expect(description.textContent.trim()).to.include('Try adjusting your search criteria');
    });

    it('should show only Add Employee button (no Load Sample Data)', async () => {
      const addButton = element.shadowRoot.querySelector('a[href="/employee/add"] app-button');
      const sampleButton = element.shadowRoot.querySelector('app-button[variant="outline"]');

      expect(addButton).to.exist;
      expect(sampleButton).to.not.exist;
    });
  });

  describe('navigation', () => {
    it('should have correct Add Employee link', async () => {
      const addLink = element.shadowRoot.querySelector('a[href="/employee/add"]');
      expect(addLink).to.exist;
      expect(addLink.getAttribute('href')).to.equal('/employee/add');
    });
  });

  describe('reactivity', () => {
    it('should update when search query changes', async () => {
      await setupEmptyStore();
      await element.updateComplete;

      let title = element.shadowRoot.querySelector('.empty-state-title');
      expect(title.textContent.trim()).to.include('No employees yet');

      employeeStore.employees = [createEmployee()];
      employeeStore.setSearchQuery('nonexistent');
      await element.updateComplete;

      title = element.shadowRoot.querySelector('.empty-state-title');
      expect(title.textContent.trim()).to.include('No employees found');
    });

    it('should update when employees are added/removed', async () => {
      await setupEmptyStore();
      await element.updateComplete;

      let sampleButton = element.shadowRoot.querySelector('app-button[variant="outline"]');
      expect(sampleButton).to.exist;

      employeeStore.employees = [createEmployee()];
      employeeStore.setSearchQuery('nonexistent');
      await element.updateComplete;

      sampleButton = element.shadowRoot.querySelector('app-button[variant="outline"]');
      expect(sampleButton).to.not.exist;
    });
  });
});
