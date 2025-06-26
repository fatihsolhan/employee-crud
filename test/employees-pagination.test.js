import { expect, fixture, html } from '@open-wc/testing';
import '../src/components/employees/pagination.js';
import { employeeStore } from '../src/services/employee-store.js';
import { setupEmptyStore, setupStore } from './test-utils.js';

describe('EmployeesPagination', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employees-pagination></employees-pagination>`);
    await setupEmptyStore(element);
  });

  it('should render the component', () => {
    expect(element).to.exist;
  });

  describe('with minimal data (no pagination needed)', () => {
    beforeEach(async () => {
      await setupStore(5, element);
    });

    it('should not render pagination when total pages <= 1', async () => {
      const pagination = element.shadowRoot.querySelector('.pagination');
      expect(pagination).to.not.exist;
    });
  });

  describe('with paginated data', () => {
    beforeEach(async () => {
      await setupStore(25, element);
    });

    it('should render pagination when totalPages > 1', async () => {
      const pagination = element.shadowRoot.querySelector('.pagination');
      expect(pagination).to.exist;
    });

    it('should display pagination info', async () => {
      const paginationInfo = element.shadowRoot.querySelector('.pagination-info');
      expect(paginationInfo).to.exist;
      expect(paginationInfo.textContent).to.include('1-10');
      expect(paginationInfo.textContent).to.include('25');
    });

    it('should display items per page selector', async () => {
      const itemsPerPageSelect = element.shadowRoot.querySelector('.items-per-page select');
      expect(itemsPerPageSelect).to.exist;

      const options = itemsPerPageSelect.querySelectorAll('option');
      expect(options).to.have.length(4);
    });

    it('should display page navigation buttons', async () => {
      const prevButton = element.shadowRoot.querySelector('app-button[disabled]');
      expect(prevButton).to.exist;

      const pageButtons = element.shadowRoot.querySelectorAll('app-button');
      expect(pageButtons.length).to.be.greaterThan(3);
    });

    it('should calculate total pages correctly', () => {
      expect(element.totalPages).to.equal(3);
    });

    it('should generate pagination info correctly', () => {
      const info = element.paginationInfo;
      expect(info).to.include('1-10');
      expect(info).to.include('25');
    });
  });

  describe('page navigation', () => {
    beforeEach(async () => {
      await setupStore(25, element);
    });

    it('should handle page change to valid page', () => {
      element.handlePageChange(2);
      expect(employeeStore.currentPage).to.equal(2);
    });

    it('should not change page to invalid page (too low)', () => {
      element.handlePageChange(0);
      expect(employeeStore.currentPage).to.equal(1);
    });

    it('should not change page to invalid page (too high)', () => {
      element.handlePageChange(5);
      expect(employeeStore.currentPage).to.equal(1);
    });

    it('should disable previous button on first page', async () => {
      employeeStore.setCurrentPage(1);
      await element.updateComplete;

      const buttons = element.shadowRoot.querySelectorAll('app-button');
      const prevButton = buttons[0];
      expect(prevButton.disabled).to.be.true;
    });

    it('should disable next button on last page', async () => {
      employeeStore.setCurrentPage(3);
      await element.updateComplete;

      const buttons = element.shadowRoot.querySelectorAll('app-button');
      const nextButton = buttons[buttons.length - 1];
      expect(nextButton.disabled).to.be.true;
    });
  });

  describe('items per page', () => {
    beforeEach(async () => {
      await setupStore(25, element);
    });

    it('should handle items per page change', () => {
      const select = element.shadowRoot.querySelector('.items-per-page select');

      element.handleItemsPerPageChange({ target: { value: '20' } });

      expect(employeeStore.itemsPerPage).to.equal(20);
    });

    it('should reset to page 1 when changing items per page', () => {
      employeeStore.setCurrentPage(2);

      element.handleItemsPerPageChange({ target: { value: '20' } });

      expect(employeeStore.currentPage).to.equal(1);
    });

    it('should have default items per page options', () => {
      expect(element.itemsPerPageOptions).to.deep.equal([5, 10, 20, 50]);
    });
  });

  describe('page button generation', () => {
    beforeEach(async () => {
      await setupStore(100, element);
    });

    it('should limit visible page buttons to maxVisiblePages', async () => {
      employeeStore.currentPage = 5;
      await element.updateComplete;

      const pageButtons = element.shadowRoot.querySelectorAll('app-button[variant*="circle"]:not([variant*="circle-active"])');

      expect(pageButtons.length).to.be.lessThan(10);
    });

    it('should highlight current page button', async () => {
      employeeStore.setCurrentPage(2);
      await element.updateComplete;

      const activeButton = element.shadowRoot.querySelector('app-button[variant="circle-active"]');
      expect(activeButton).to.exist;
      expect(activeButton.textContent.trim()).to.equal('2');
    });
  });

  describe('responsive design', () => {
    it('should have responsive CSS', () => {
      const styles = element.constructor.styles;
      expect(styles).to.exist;

      const cssText = styles.toString();
      expect(cssText).to.include('@media');
      expect(cssText).to.include('flex-direction: column');
    });

    it('should have mobile-specific pagination styles', () => {
      const styles = element.constructor.styles;
      const cssText = styles.toString();
      expect(cssText).to.include('overflow-x: auto');
      expect(cssText).to.include('scrollbar-width: none');
    });
  });

  describe('localization', () => {
    it('should display localized pagination info', async () => {
      await setupStore(25, element);

      const paginationInfo = element.shadowRoot.querySelector('.pagination-info');
      expect(paginationInfo).to.exist;
      expect(paginationInfo.textContent).to.match(/\d+-\d+.*\d+/);
    });
  });

  describe('event listeners', () => {
    it('should update on store settings changes', async () => {
      const originalRequestUpdate = element.requestUpdate;
      let updateCalled = false;
      element.requestUpdate = () => { updateCalled = true; };

      employeeStore.dispatchEvent(new CustomEvent('settings-changed'));

      expect(updateCalled).to.be.true;
      element.requestUpdate = originalRequestUpdate;
    });

    it('should update on employees changes', async () => {
      const originalRequestUpdate = element.requestUpdate;
      let updateCalled = false;
      element.requestUpdate = () => { updateCalled = true; };

      employeeStore.dispatchEvent(new CustomEvent('employees-changed'));

      expect(updateCalled).to.be.true;
      element.requestUpdate = originalRequestUpdate;
    });
  });
});
