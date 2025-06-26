
class EmployeeStore extends EventTarget {
  constructor() {
    super();
    this.employees = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.viewMode = 'table';
    this.searchQuery = '';
    this.selectedEmployeeIds = new Set();
    this.loadEmployees();
    this.loadSettings();
  }

  loadEmployees() {
    const stored = localStorage.getItem('employees');
    if (stored) {
      this.employees = JSON.parse(stored).map(emp => ({
        ...emp,
        dateOfEmployment: emp.dateOfEmployment ? new Date(emp.dateOfEmployment) : emp.dateOfEmployment,
        dateOfBirth: emp.dateOfBirth ? new Date(emp.dateOfBirth) : emp.dateOfBirth
      }));
    } else {
      this.employees = [];
    }
  }

  loadSettings() {
    const settings = localStorage.getItem('employeeStoreSettings');
    if (settings) {
      const parsed = JSON.parse(settings);
      this.currentPage = parsed.currentPage || 1;
      this.itemsPerPage = parsed.itemsPerPage || 10;
      this.viewMode = parsed.viewMode || 'table';
      this.searchQuery = parsed.searchQuery || '';
    }
  }

  saveSettings() {
    const settings = {
      currentPage: this.currentPage,
      itemsPerPage: this.itemsPerPage,
      viewMode: this.viewMode,
      searchQuery: this.searchQuery
    };
    localStorage.setItem('employeeStoreSettings', JSON.stringify(settings));
    this.dispatchEvent(new CustomEvent('settings-changed', { detail: settings }));
  }

  saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(this.employees));
    this.dispatchEvent(new CustomEvent('employees-changed', { detail: this.employees }));
  }

  getAllEmployees() {
    return this.employees;
  }

  getEmployeeById(id) {
    return this.employees.find(emp => emp.id === id);
  }

  addEmployee(employeeData) {
    const newEmployee = {
      ...employeeData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    this.employees.push(newEmployee);
    this.saveEmployees();
    return newEmployee;
  }

  updateEmployee(id, employeeData) {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.employees[index] = { ...employeeData, id };
      this.saveEmployees();
      return this.employees[index];
    }
    return null;
  }

  deleteEmployee(id) {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      const deleted = this.employees.splice(index, 1)[0];
      this.saveEmployees();
      return deleted;
    }
    return null;
  }

  isEmailUnique(email, excludeId = null) {
    return !this.employees.some(emp => emp.email === email && emp.id !== excludeId);
  }

  isPhoneUnique(phone, excludeId = null) {
    return !this.employees.some(emp => emp.phone === phone && emp.id !== excludeId);
  }
  getCurrentPage() {
    return this.currentPage;
  }

  setCurrentPage(page) {
    this.currentPage = page;
    this.saveSettings();
  }

  getItemsPerPage() {
    return this.itemsPerPage;
  }

  setItemsPerPage(items) {
    this.itemsPerPage = items;
    this.currentPage = 1;
    this.saveSettings();
  }

  getViewMode() {
    return this.viewMode;
  }

  setViewMode(mode) {
    this.viewMode = mode;
    this.saveSettings();
  }

  getSearchQuery() {
    return this.searchQuery;
  }

  setSearchQuery(query) {
    this.searchQuery = query;
    this.currentPage = 1;
    this.saveSettings();
  }

  getFilteredEmployees() {
    if (!this.searchQuery || !this.searchQuery.trim()) {
      return this.employees;
    }

    const query = this.searchQuery.toLowerCase();
    return this.employees.filter(employee => {
      return (employee.firstName && employee.firstName.toLowerCase().includes(query)) ||
             (employee.lastName && employee.lastName.toLowerCase().includes(query)) ||
             (employee.email && employee.email.toLowerCase().includes(query)) ||
             (employee.phone && employee.phone.toLowerCase().includes(query)) ||
             (employee.department && employee.department.toLowerCase().includes(query)) ||
             (employee.position && employee.position.toLowerCase().includes(query));
    });
  }

  getPaginatedEmployees() {
    const filteredEmployees = this.getFilteredEmployees();
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return filteredEmployees.slice(start, end);
  }

  getPaginationInfo(filteredCount) {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, filteredCount);
    return { start, end, total: filteredCount };
  }

  seedData() {
    const seedEmployees = [
      { firstName: 'Fatih', lastName: 'Solhan', email: 'fatih.solhan@hotmail.com', phone: '+90 555 555 55 55', department: 'Tech', position: 'Senior', dateOfEmployment: new Date(2022, 8, 23), dateOfBirth: new Date(1997, 12, 29) },
      { firstName: 'Elif', lastName: 'Kaya', email: 'elif.kaya@example.com', phone: '+90 533 234 56 78', department: 'Tech', position: 'Senior', dateOfEmployment: new Date(2021, 4, 15), dateOfBirth: new Date(1988, 2, 12) },
      { firstName: 'Mehmet', lastName: 'Demir', email: 'mehmet.demir@example.com', phone: '+90 534 345 67 89', department: 'Analytics', position: 'Medior', dateOfEmployment: new Date(2022, 0, 10), dateOfBirth: new Date(1990, 6, 8) },
      { firstName: 'Ayşe', lastName: 'Yılmaz', email: 'ayse.yilmaz@example.com', phone: '+90 535 456 78 90', department: 'Tech', position: 'Junior', dateOfEmployment: new Date(2023, 2, 1), dateOfBirth: new Date(1995, 10, 20) },
      { firstName: 'Can', lastName: 'Özkan', email: 'can.ozkan@example.com', phone: '+90 536 567 89 01', department: 'Analytics', position: 'Senior', dateOfEmployment: new Date(2020, 7, 12), dateOfBirth: new Date(1987, 0, 15) },
      { firstName: 'Zeynep', lastName: 'Arslan', email: 'zeynep.arslan@example.com', phone: '+90 537 678 90 12', department: 'Tech', position: 'Medior', dateOfEmployment: new Date(2021, 10, 5), dateOfBirth: new Date(1991, 4, 30) },
      { firstName: 'Emre', lastName: 'Koç', email: 'emre.koc@example.com', phone: '+90 538 789 01 23', department: 'Analytics', position: 'Junior', dateOfEmployment: new Date(2023, 0, 20), dateOfBirth: new Date(1994, 8, 10) },
      { firstName: 'Seda', lastName: 'Avcı', email: 'seda.avci@example.com', phone: '+90 539 890 12 34', department: 'Tech', position: 'Senior', dateOfEmployment: new Date(2019, 11, 3), dateOfBirth: new Date(1986, 11, 25) },
      { firstName: 'Burak', lastName: 'Şahin', email: 'burak.sahin@example.com', phone: '+90 540 901 23 45', department: 'Analytics', position: 'Medior', dateOfEmployment: new Date(2022, 5, 18), dateOfBirth: new Date(1989, 3, 14) },
      { firstName: 'Gizem', lastName: 'Çelik', email: 'gizem.celik@example.com', phone: '+90 541 012 34 56', department: 'Tech', position: 'Junior', dateOfEmployment: new Date(2023, 3, 25), dateOfBirth: new Date(1996, 7, 7) },
      { firstName: 'Oğuz', lastName: 'Karahan', email: 'oguz.karahan@example.com', phone: '+90 542 123 45 67', department: 'Analytics', position: 'Senior', dateOfEmployment: new Date(2020, 1, 14), dateOfBirth: new Date(1985, 9, 28) },
      { firstName: 'Tuğba', lastName: 'Polat', email: 'tugba.polat@example.com', phone: '+90 543 234 56 78', department: 'Tech', position: 'Medior', dateOfEmployment: new Date(2021, 8, 30), dateOfBirth: new Date(1990, 5, 18) },
      { firstName: 'Serkan', lastName: 'Güler', email: 'serkan.guler@example.com', phone: '+90 544 345 67 89', department: 'Analytics', position: 'Junior', dateOfEmployment: new Date(2023, 1, 12), dateOfBirth: new Date(1993, 10, 5) },
      { firstName: 'İrem', lastName: 'Başaran', email: 'irem.basaran@example.com', phone: '+90 545 456 78 90', department: 'Tech', position: 'Senior', dateOfEmployment: new Date(2018, 6, 22), dateOfBirth: new Date(1984, 1, 14) },
      { firstName: 'Enes', lastName: 'Yıldız', email: 'enes.yildiz@example.com', phone: '+90 546 567 89 01', department: 'Analytics', position: 'Medior', dateOfEmployment: new Date(2022, 3, 8), dateOfBirth: new Date(1988, 8, 12) },
      { firstName: 'Merve', lastName: 'Duran', email: 'merve.duran@example.com', phone: '+90 547 678 90 12', department: 'Tech', position: 'Junior', dateOfEmployment: new Date(2023, 4, 15), dateOfBirth: new Date(1997, 0, 22) },
      { firstName: 'Murat', lastName: 'Keskin', email: 'murat.keskin@example.com', phone: '+90 548 789 01 23', department: 'Analytics', position: 'Senior', dateOfEmployment: new Date(2019, 9, 11), dateOfBirth: new Date(1983, 6, 3) },
      { firstName: 'Gül', lastName: 'Öztürk', email: 'gul.ozturk@example.com', phone: '+90 549 890 12 34', department: 'Tech', position: 'Medior', dateOfEmployment: new Date(2021, 11, 20), dateOfBirth: new Date(1989, 11, 8) },
      { firstName: 'Kerem', lastName: 'Aydın', email: 'kerem.aydin@example.com', phone: '+90 550 901 23 45', department: 'Analytics', position: 'Junior', dateOfEmployment: new Date(2023, 2, 18), dateOfBirth: new Date(1995, 4, 16) },
      { firstName: 'Buse', lastName: 'Kılıç', email: 'buse.kilic@example.com', phone: '+90 551 012 34 56', department: 'Tech', position: 'Senior', dateOfEmployment: new Date(2018, 10, 7), dateOfBirth: new Date(1982, 7, 29) },
    ];

    this.employees = [];
    seedEmployees.forEach(emp => {
      this.addEmployee(emp);
    });
  }

  toggleEmployeeSelection(employeeId) {
    if (this.selectedEmployeeIds.has(employeeId)) {
      this.selectedEmployeeIds.delete(employeeId);
    } else {
      this.selectedEmployeeIds.add(employeeId);
    }
    this.dispatchEvent(new CustomEvent('selection-changed'));
  }

  selectAllVisible() {
    const paginatedEmployees = this.getPaginatedEmployees();
    paginatedEmployees.forEach(emp => this.selectedEmployeeIds.add(emp.id));
    this.dispatchEvent(new CustomEvent('selection-changed'));
  }

  clearSelection() {
    this.selectedEmployeeIds.clear();
    this.dispatchEvent(new CustomEvent('selection-changed'));
  }

  getSelectedCount() {
    return this.selectedEmployeeIds.size;
  }

  isEmployeeSelected(employeeId) {
    return this.selectedEmployeeIds.has(employeeId);
  }

  getSelectionState() {
    const visibleEmployees = this.getPaginatedEmployees();
    const selectedInVisible = visibleEmployees.filter(emp => this.selectedEmployeeIds.has(emp.id));

    if (selectedInVisible.length === 0) return 'none';
    if (selectedInVisible.length === visibleEmployees.length && visibleEmployees.length > 0) return 'all';
    return 'some';
  }

}

export const employeeStore = new EmployeeStore();
