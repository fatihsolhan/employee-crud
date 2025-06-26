import { expect } from '@open-wc/testing';
import { employeeStore } from '../src/services/employee-store.js';
import { createEmployee } from './test-utils.js';

describe('EmployeeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    employeeStore.employees = [];
    employeeStore.loadEmployees();
  });

  describe('loadEmployees', () => {
    it('should load employees from localStorage', () => {
      const testEmployees = [createEmployee()];

      localStorage.setItem('employees', JSON.stringify(testEmployees));
      employeeStore.loadEmployees();

      expect(employeeStore.employees).to.have.length(1);
      expect(employeeStore.employees[0].firstName).to.equal('John');
      expect(employeeStore.employees[0].lastName).to.equal('Doe');
    });

    it('should initialize empty array when no data in localStorage', () => {
      employeeStore.loadEmployees();
      expect(employeeStore.employees).to.deep.equal([]);
    });
  });

  describe('getAllEmployees', () => {
    it('should return a copy of all employees', () => {
      const testEmployees = [
        createEmployee({ id: '1' }),
        createEmployee({ id: '2', firstName: 'Jane', lastName: 'Smith' })
      ];

      employeeStore.employees = testEmployees;
      const result = employeeStore.getAllEmployees();

      expect(result).to.deep.equal(testEmployees);
      expect(result).to.equal(testEmployees);
    });
  });

  describe('getEmployeeById', () => {
    it('should return employee with matching id', () => {
      const testEmployee = createEmployee({ id: '1' });
      employeeStore.employees = [testEmployee];

      const result = employeeStore.getEmployeeById('1');
      expect(result).to.equal(testEmployee);
    });

    it('should return undefined for non-existent id', () => {
      employeeStore.employees = [];
      const result = employeeStore.getEmployeeById('999');
      expect(result).to.be.undefined;
    });
  });

  describe('addEmployee', () => {
    it('should add new employee with generated id', () => {
      const employeeData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      };

      const result = employeeStore.addEmployee(employeeData);

      expect(result.id).to.exist;
      expect(result.firstName).to.equal('John');
      expect(employeeStore.employees).to.have.length(1);
    });

    it('should trigger employees-changed event', (done) => {
      const handler = () => {
        employeeStore.removeEventListener('employees-changed', handler);
        done();
      };
      employeeStore.addEventListener('employees-changed', handler);

      employeeStore.addEmployee(createEmployee());
    });
  });

  describe('updateEmployee', () => {
    it('should update existing employee', () => {
      const originalEmployee = createEmployee({ id: '1' });
      employeeStore.employees = [originalEmployee];

      const updatedData = { firstName: 'Jane', lastName: 'Smith' };
      const result = employeeStore.updateEmployee('1', updatedData);

      expect(result.id).to.equal('1');
      expect(result.firstName).to.equal('Jane');
      expect(result.lastName).to.equal('Smith');
    });

    it('should return null for non-existent employee', () => {
      employeeStore.employees = [];
      const result = employeeStore.updateEmployee('999', { firstName: 'John' });
      expect(result).to.be.null;
    });
  });

  describe('deleteEmployee', () => {
    it('should remove employee and return deleted employee', () => {
      const employee = createEmployee({ id: '1' });
      employeeStore.employees = [employee];

      const result = employeeStore.deleteEmployee('1');

      expect(result).to.deep.equal(employee);
      expect(employeeStore.employees).to.have.length(0);
    });

    it('should return null for non-existent employee', () => {
      employeeStore.employees = [];
      const result = employeeStore.deleteEmployee('999');
      expect(result).to.be.null;
    });
  });

  describe('isEmailUnique', () => {
    beforeEach(() => {
      employeeStore.employees = [
        createEmployee({ id: '1' }),
        createEmployee({ id: '2', email: 'jane@example.com' })
      ];
    });

    it('should return false for existing email', () => {
      const result = employeeStore.isEmailUnique('john@example.com');
      expect(result).to.be.false;
    });

    it('should return true for new email', () => {
      const result = employeeStore.isEmailUnique('new@example.com');
      expect(result).to.be.true;
    });

    it('should exclude specific id from check', () => {
      const result = employeeStore.isEmailUnique('john@example.com', '1');
      expect(result).to.be.true;
    });
  });

  describe('isPhoneUnique', () => {
    beforeEach(() => {
      employeeStore.employees = [
        createEmployee({ id: '1' }),
        createEmployee({ id: '2', phone: '+0987654321' })
      ];
    });

    it('should return false for existing phone', () => {
      const result = employeeStore.isPhoneUnique('+1234567890');
      expect(result).to.be.false;
    });

    it('should return true for new phone', () => {
      const result = employeeStore.isPhoneUnique('+1111111111');
      expect(result).to.be.true;
    });

    it('should exclude specific id from check', () => {
      const result = employeeStore.isPhoneUnique('+1234567890', '1');
      expect(result).to.be.true;
    });
  });
});
