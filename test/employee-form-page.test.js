import { expect, fixture, html } from '@open-wc/testing';
import '../src/components/employee-form-page.js';
import { employeeStore } from '../src/services/employee-store.js';
import { createEmployee, setupEmptyStore } from './test-utils.js';

describe('EmployeeFormPage', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employee-form-page></employee-form-page>`);
    await setupEmptyStore();
    await element.updateComplete;
  });

  it('should render the component', () => {
    expect(element).to.exist;
  });

  it('should display form with all required fields', async () => {
    await element.updateComplete;

    const form = element.shadowRoot.querySelector('form');
    expect(form).to.exist;

    const firstNameInput = element.shadowRoot.querySelector('#firstName');
    const lastNameInput = element.shadowRoot.querySelector('#lastName');
    const emailInput = element.shadowRoot.querySelector('#email');
    const phoneInput = element.shadowRoot.querySelector('#phone');
    const dobInput = element.shadowRoot.querySelector('#dateOfBirth');
    const employmentDateInput = element.shadowRoot.querySelector('#dateOfEmployment');
    const departmentSelect = element.shadowRoot.querySelector('#department');
    const positionSelect = element.shadowRoot.querySelector('#position');

    expect(firstNameInput).to.exist;
    expect(lastNameInput).to.exist;
    expect(emailInput).to.exist;
    expect(phoneInput).to.exist;
    expect(dobInput).to.exist;
    expect(employmentDateInput).to.exist;
    expect(departmentSelect).to.exist;
    expect(positionSelect).to.exist;
  });

  it('should have correct department options', async () => {
    await element.updateComplete;

    const departmentSelect = element.shadowRoot.querySelector('#department');
    const options = departmentSelect.querySelectorAll('option');

    expect(options).to.have.length(3);
    expect(options[1].value).to.equal('Analytics');
    expect(options[2].value).to.equal('Tech');
  });

  it('should have correct position options', async () => {
    await element.updateComplete;

    const positionSelect = element.shadowRoot.querySelector('#position');
    const options = positionSelect.querySelectorAll('option');

    expect(options).to.have.length(4);
    expect(options[1].value).to.equal('Junior');
    expect(options[2].value).to.equal('Medior');
    expect(options[3].value).to.equal('Senior');
  });

  it('should display submit and cancel buttons', async () => {
    await element.updateComplete;

    const submitButton = element.shadowRoot.querySelector('#submit-button');
    const cancelButton = element.shadowRoot.querySelector('#cancel-button');

    expect(submitButton).to.exist;
    expect(cancelButton).to.exist;
  });

  describe('form validation', () => {
    beforeEach(async () => {
      await element.updateComplete;
    });

    it('should validate required fields', () => {
      element.employee = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        dateOfEmployment: '',
        department: '',
        position: ''
      };

      const isValid = element.validateForm();
      expect(isValid).to.be.false;
      expect(Object.keys(element.errors)).to.have.length.greaterThan(0);
    });

    it('should validate email format', () => {
      element.employee = createEmployee({
        email: 'invalid-email',
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01'
      });

      const isValid = element.validateForm();
      expect(isValid).to.be.false;
      expect(element.errors.email).to.exist;
    });

    it('should validate phone format', () => {
      element.employee = createEmployee({
        phone: 'invalid-phone',
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01'
      });

      const isValid = element.validateForm();
      expect(isValid).to.be.false;
      expect(element.errors.phone).to.exist;
    });

    it('should validate age range', () => {
      const today = new Date();
      const invalidBirthDate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());

      element.employee = createEmployee({
        dateOfBirth: invalidBirthDate.toISOString().split('T')[0],
        dateOfEmployment: '2020-01-01'
      });

      const isValid = element.validateForm();
      expect(isValid).to.be.false;
      expect(element.errors.dateOfBirth).to.exist;
    });

    it('should validate employment date not in future', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      element.employee = createEmployee({
        dateOfBirth: '1990-01-01',
        dateOfEmployment: futureDate.toISOString().split('T')[0]
      });

      const isValid = element.validateForm();
      expect(isValid).to.be.false;
      expect(element.errors.dateOfEmployment).to.exist;
    });

    it('should validate email uniqueness', () => {
      employeeStore.employees = [createEmployee({
        id: '1',
        email: 'existing@example.com'
      })];

      element.employee = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        phone: '+1234567890',
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01',
        department: 'Tech',
        position: 'Junior'
      };

      const isValid = element.validateForm();
      expect(isValid).to.be.false;
      expect(element.errors.email).to.exist;
    });

    it('should validate phone uniqueness', () => {
      employeeStore.employees = [createEmployee({
        id: '1',
        phone: '+1234567890'
      })];

      element.employee = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01',
        department: 'Tech',
        position: 'Junior'
      };

      const isValid = element.validateForm();
      expect(isValid).to.be.false;
      expect(element.errors.phone).to.exist;
    });

    it('should pass validation with valid data', () => {
      element.employee = createEmployee({
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01'
      });

      const isValid = element.validateForm();
      expect(isValid).to.be.true;
      expect(Object.keys(element.errors)).to.have.length(0);
    });
  });

  describe('input handling', () => {
    beforeEach(async () => {
      await element.updateComplete;
    });

    it('should update employee data on input change', () => {
      element.handleInputChange('firstName', 'John');
      expect(element.employee.firstName).to.equal('John');
    });

    it('should clear field error on input change', () => {
      element.errors = { firstName: 'Error message' };
      element.handleInputChange('firstName', 'John');
      expect(element.errors.firstName).to.be.null;
    });
  });

  describe('form submission', () => {
    beforeEach(async () => {
      element.employee = createEmployee({
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01'
      });
      await element.updateComplete;
    });

    it('should not submit if validation fails', async () => {
      element.employee.firstName = '';

      const form = element.shadowRoot.querySelector('form');
      const event = new Event('submit');
      event.preventDefault = () => {};

      form.dispatchEvent(event);

      expect(employeeStore.employees).to.have.length(0);
    });

    it('should show confirmation dialog before submission', async () => {
      const submitButton = element.shadowRoot.querySelector('#submit-button');
      submitButton.click();
      await element.updateComplete;

      const modal = element.shadowRoot.querySelector('app-modal');
      expect(modal).to.exist;
      expect(modal.open).to.be.true;
    });
  });

  describe('edit mode', () => {
    beforeEach(async () => {
      const testEmployee = createEmployee({
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01'
      });

      employeeStore.employees = [testEmployee];
      element.mode = 'edit';
      element.employeeId = '1';
      await element.updateComplete;
      element.loadEmployee();
      await element.updateComplete;
    });

    it('should load employee data in edit mode', () => {
      expect(element.employee.firstName).to.equal('John');
      expect(element.employee.lastName).to.equal('Doe');
      expect(element.employee.email).to.equal('john@example.com');
    });

    it('should display correct title in edit mode', async () => {
      await element.updateComplete;
      const title = element.shadowRoot.querySelector('h1');
      expect(title.textContent).to.include('Edit');
    });

    it('should display update button in edit mode', async () => {
      await element.updateComplete;
      const submitButton = element.shadowRoot.querySelector('#submit-button');
      expect(submitButton.textContent).to.include('Update');
    });
  });

  describe('navigation', () => {
    it('should navigate to list on cancel', () => {
      let navigated = false;
      const originalPushState = window.history.pushState;
      window.history.pushState = () => { navigated = true; };

      element.handleCancel();

      expect(navigated).to.be.true;
      window.history.pushState = originalPushState;
    });

    it('should navigate to list after successful submission', async () => {
      let navigated = false;
      const originalPushState = window.history.pushState;
      window.history.pushState = () => { navigated = true; };

      element.employee = createEmployee({
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01'
      });

      element.handleSubmit();
      await element.updateComplete;

      await element.handleConfirmSubmit({ detail: { confirmed: true } });

      expect(navigated).to.be.true;
      window.history.pushState = originalPushState;
    });
  });
});
