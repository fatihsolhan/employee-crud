import { employeeStore } from '../src/services/employee-store.js';

export function createEmployee(overrides = {}) {
  return {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    department: 'Tech',
    position: 'Senior',
    dateOfEmployment: new Date('2020-01-01'),
    dateOfBirth: new Date('1990-01-01'),
    ...overrides
  };
}

export function createEmployees(count = 5, baseOverrides = {}) {
  return Array.from({ length: count }, (_, i) => 
    createEmployee({
      id: (i + 1).toString(),
      firstName: `Employee${i + 1}`,
      lastName: 'Test',
      email: `employee${i + 1}@example.com`,
      phone: `+123456789${i}`,
      ...baseOverrides
    })
  );
}

export function resetStore(employees = []) {
  localStorage.clear();
  employeeStore.employees = employees;
  employeeStore.selectedEmployeeIds.clear();
  employeeStore.searchQuery = '';
  employeeStore.currentPage = 1;
  employeeStore.itemsPerPage = 10;
}

export function triggerEvents() {
  employeeStore.dispatchEvent(new CustomEvent('employees-changed'));
  employeeStore.dispatchEvent(new CustomEvent('settings-changed'));
}

export async function setupStore(employeesOrCount = [], element = null) {
  const employees = Array.isArray(employeesOrCount) 
    ? employeesOrCount 
    : createEmployees(employeesOrCount);
  
  resetStore(employees);
  triggerEvents();
  
  if (element) {
    await element.updateComplete;
  }
  
  return employees;
}

export async function setupEmptyStore(element = null, searchQuery = '') {
  resetStore([]);
  employeeStore.searchQuery = searchQuery;
  triggerEvents();
  
  if (element) {
    await element.updateComplete;
  }
}

export function mockStore(methods) {
  const original = {};
  Object.keys(methods).forEach(key => {
    original[key] = employeeStore[key];
    employeeStore[key] = methods[key];
  });
  return original;
}

export function restoreStore(original) {
  Object.keys(original).forEach(key => {
    employeeStore[key] = original[key];
  });
}