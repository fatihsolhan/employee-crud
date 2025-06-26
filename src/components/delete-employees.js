import { msg, str, updateWhenLocaleChanges } from '@lit/localize';
import { LitElement, html } from 'lit';
import { employeeStore } from '../services/employee-store';
import './ui/app-modal';

export class DeleteEmployees extends LitElement {
  static properties = {
    employeeIds: { type: Array },
    open: { type: Boolean }
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.employeeIds = [];
    this.open = false;
  }

  get employees() {
    return this.employeeIds.map(id => employeeStore.getEmployeeById(id)).filter(Boolean);
  }

  get isIndividual() {
    return this.employeeIds.length === 1;
  }

  get modalTitle() {
    return this.isIndividual ? msg('Delete Employee') : msg('Delete Employees');
  }

  get modalMessage() {
    if (this.isIndividual && this.employees.length > 0) {
      const employee = this.employees[0];
      return msg(str`Are you sure you want to delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`, {
        desc: 'Confirmation message for deleting a single employee'
      });
    }
    return msg(str`Are you sure you want to delete ${this.employeeIds.length} employee(s)? This action cannot be undone.`, {
      desc: 'Confirmation message for deleting multiple employees'
    });
  }

  handleDeleteConfirm(e) {
    if (e.detail.confirmed) {
      this.employeeIds.forEach(id => employeeStore.deleteEmployee(id));
      employeeStore.clearSelection();
    }
    this.close();
  }

  close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('delete-closed', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <app-modal
        .open=${this.open}
        title="${this.modalTitle}"
        message="${this.modalMessage}"
        confirmText="${msg('Delete')}"
        cancelText="${msg('Cancel')}"
        @modal-closed=${this.handleDeleteConfirm}
      ></app-modal>
    `;
  }
}

customElements.define('delete-employees', DeleteEmployees);
