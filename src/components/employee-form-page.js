import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { LitElement, css, html } from 'lit';
import { employeeStore } from '../services/employee-store.js';
import { containerStyles, cssVariables, resetCss } from '../styles/shared-styles.js';
import './ui/app-button.js';
import './ui/app-input.js';
import './ui/app-modal.js';

export class EmployeeFormPage extends LitElement {
  static styles = [
    resetCss,
    containerStyles,
    cssVariables,
    css`
      .header {
        background: white;
        border-radius: 0.75rem;
        padding: 2rem;
        margin: 2rem 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
      }

      .page-title {
        font-size: 1.875rem;
        font-weight: 600;
        color: var(--primary-color);
        margin: 0 0 1rem 0;
      }

      .back-link {
        color: #6E6E6E;
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: color 0.2s ease;
      }

      .back-link:hover {
        color: var(--primary-color);
      }

      .form-container {
        background: white;
        border-radius: 0.75rem;
        padding: 2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
      }

      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-group.full-width {
        grid-column: 1 / -1;
      }

      .form-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #333;
      }

      .required {
        color: #dc2626;
      }

      .form-select {
        padding: 0.75rem 1rem;
        border: 1px solid #e1e1e1;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        background: white;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      .form-select:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px var(--primary-color-light);
      }

      .form-select.error {
        border-color: #dc2626;
      }

      .form-error {
        font-size: 0.75rem;
        color: #dc2626;
        margin-top: 0.25rem;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: space-between
      }

      @media (max-width: 768px) {
        .container {
          padding: 0 0.5rem;
        }

        .header,
        .form-container {
          padding: 1.5rem;
        }

        .form-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
      }
    `
  ];

  static properties = {
    mode: { type: String },
    employeeId: { type: String },
    employee: { type: Object, state: true },
    errors: { type: Object, state: true },
    showConfirmModal: { type: Boolean },
    isSubmitting: { type: Boolean }
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.mode = 'add';
    this.employeeId = null;
    this.employee = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: ''
    };
    this.errors = {};
    this.showConfirmModal = false;
    this.isSubmitting = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.checkAndLoadEmployee();
  }

  updated(changedProperties) {
    if (changedProperties.has('mode') || changedProperties.has('employeeId')) {
      this.updateComplete.then(() => {
        this.checkAndLoadEmployee();
      });
    }
  }

  checkAndLoadEmployee() {
    if (this.mode === 'edit' && this.employeeId) {
      this.loadEmployee();
    } else if (this.mode === 'add') {
      this.resetForm();
    }
  }

  resetForm() {
    this.employee = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: ''
    };
    this.errors = {};
  }

  loadEmployee() {
    const employee = employeeStore.getEmployeeById(this.employeeId);
    if (employee) {
      this.employee = {
        ...employee,
        dateOfEmployment: employee.dateOfEmployment instanceof Date ?
          employee.dateOfEmployment.toISOString().split('T')[0] : employee.dateOfEmployment,
        dateOfBirth: employee.dateOfBirth instanceof Date ?
          employee.dateOfBirth.toISOString().split('T')[0] : employee.dateOfBirth
      };
    }
  }

  handleInputChange(field, value) {
    const newValue = value !== undefined ? value : '';
    this.employee = { ...this.employee, [field]: newValue };
    if (this.errors[field]) {
      this.errors = { ...this.errors, [field]: null };
    }
  }

  validateForm() {
    const errors = {};

    if (!this.employee.firstName || !this.employee.firstName.trim()) {
      errors.firstName = msg('First name is required');
    }

    if (!this.employee.lastName || !this.employee.lastName.trim()) {
      errors.lastName = msg('Last name is required');
    }

    if (!this.employee.email || !this.employee.email.trim()) {
      errors.email = msg('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(this.employee.email)) {
      errors.email = msg('Please enter a valid email address');
    } else if (!employeeStore.isEmailUnique(this.employee.email, this.employeeId)) {
      errors.email = msg('Email address already exists');
    }

    if (!this.employee.phone || !this.employee.phone.trim()) {
      errors.phone = msg('Phone number is required');
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(this.employee.phone)) {
      errors.phone = msg('Please enter a valid phone number');
    } else if (!employeeStore.isPhoneUnique(this.employee.phone, this.employeeId)) {
      errors.phone = msg('Phone number already exists');
    }

    if (!this.employee.dateOfBirth) {
      errors.dateOfBirth = msg('Date of birth is required');
    } else {
      const birthDate = new Date(this.employee.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18 || age > 65) {
        errors.dateOfBirth = msg('Employee must be between 18 and 65 years old');
      }
    }

    if (!this.employee.dateOfEmployment) {
      errors.dateOfEmployment = msg('Date of employment is required');
    } else {
      const employmentDate = new Date(this.employee.dateOfEmployment);
      const today = new Date();
      if (employmentDate > today) {
        errors.dateOfEmployment = msg('Employment date cannot be in the future');
      }
    }

    if (!this.employee.department) {
      errors.department = msg('Department is required');
    }

    if (!this.employee.position) {
      errors.position = msg('Position is required');
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  handleSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.showConfirmModal = true;
  }

  async handleConfirmSubmit(e) {
    if (e.detail.confirmed) {
      this.isSubmitting = true;
      try {
        const employeeData = {
          ...this.employee,
          dateOfEmployment: this.employee.dateOfEmployment ? new Date(this.employee.dateOfEmployment) : null,
          dateOfBirth: this.employee.dateOfBirth ? new Date(this.employee.dateOfBirth) : null
        };

        if (this.mode === 'add') {
          employeeStore.addEmployee(employeeData);
        } else {
          employeeStore.updateEmployee(this.employeeId, employeeData);
        }
        await new Promise(resolve => setTimeout(resolve, 300));
        this.navigateToList();
      } catch (error) {
        console.error('Error saving employee:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
    this.showConfirmModal = false;
  }

  handleCancel() {
    this.navigateToList();
  }

  navigateToList() {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  render() {
    const title = this.mode === 'add' ? msg('Add New Employee') : msg('Edit Employee');

    return html`
      <div class="container">
        <div class="header">
          <h1 class="page-title">
            ${title}
          </h1>
          <a href="#" class="back-link" @click=${this.handleCancel}>
←
            ${msg('Back to Employee List')}
          </a>
        </div>

      <div class="form-container">
        <form @submit=${this.handleSubmit}>
          <div class="form-grid">
            <div class="form-group">
              <app-input
                id="firstName"
                label="${msg('First Name')} *"
                type="text"
                .value=${this.employee.firstName}
                @app-input-change=${(e) => this.handleInputChange('firstName', e.detail.value)}
                class="${this.errors.firstName ? 'error' : ''}"
              ></app-input>
              ${this.errors.firstName ? html`<div class="form-error">${this.errors.firstName}</div>` : ''}
            </div>

            <div class="form-group">
              <app-input
                id="lastName"
                label="${msg('Last Name')} *"
                type="text"
                .value=${this.employee.lastName}
                @app-input-change=${(e) => this.handleInputChange('lastName', e.detail.value)}
                class="${this.errors.lastName ? 'error' : ''}"
              ></app-input>
              ${this.errors.lastName ? html`<div class="form-error">${this.errors.lastName}</div>` : ''}
            </div>

            <div class="form-group">
              <app-input
                id="dateOfEmployment"
                label="${msg('Date of Employment')} *"
                type="date"
                .value=${this.employee.dateOfEmployment}
                @app-input-change=${(e) => this.handleInputChange('dateOfEmployment', e.detail.value)}
                class="${this.errors.dateOfEmployment ? 'error' : ''}"
              ></app-input>
              ${this.errors.dateOfEmployment ? html`<div class="form-error">${this.errors.dateOfEmployment}</div>` : ''}
            </div>

            <div class="form-group">
              <app-input
                id="dateOfBirth"
                label="${msg('Date of Birth')} *"
                type="date"
                .value=${this.employee.dateOfBirth}
                @app-input-change=${(e) => this.handleInputChange('dateOfBirth', e.detail.value)}
                class="${this.errors.dateOfBirth ? 'error' : ''}"
              ></app-input>
              ${this.errors.dateOfBirth ? html`<div class="form-error">${this.errors.dateOfBirth}</div>` : ''}
            </div>

            <div class="form-group">
              <app-input
                id="phone"
                label="${msg('Phone Number')} *"
                type="tel"
                .value=${this.employee.phone}
                @app-input-change=${(e) => this.handleInputChange('phone', e.detail.value)}
                class="${this.errors.phone ? 'error' : ''}"
              ></app-input>
              ${this.errors.phone ? html`<div class="form-error">${this.errors.phone}</div>` : ''}
            </div>

            <div class="form-group full-width">
              <app-input
                id="email"
                label="${msg('Email Address')} *"
                type="email"
                .value=${this.employee.email}
                @app-input-change=${(e) => this.handleInputChange('email', e.detail.value)}
                class="${this.errors.email ? 'error' : ''}"
              ></app-input>
              ${this.errors.email ? html`<div class="form-error">${this.errors.email}</div>` : ''}
            </div>

            <div class="form-group">
              <label class="form-label">${msg('Department')} <span class="required">*</span></label>
              <select
                id="department"
                class="form-select ${this.errors.department ? 'error' : ''}"
                .value=${this.employee.department}
                @change=${(e) => this.handleInputChange('department', e.target.value)}
              >
                <option value="">${msg('Select Department')}</option>
                <option value="Analytics">${msg('Analytics')}</option>
                <option value="Tech">${msg('Tech')}</option>
              </select>
              ${this.errors.department ? html`<div class="form-error">${this.errors.department}</div>` : ''}
            </div>

            <div class="form-group">
              <label class="form-label">${msg('Position')} <span class="required">*</span></label>
              <select
                id="position"
                class="form-select ${this.errors.position ? 'error' : ''}"
                .value=${this.employee.position}
                @change=${(e) => this.handleInputChange('position', e.target.value)}
              >
                <option value="">${msg('Select Position')}</option>
                <option value="Junior">${msg('Junior')}</option>
                <option value="Medior">${msg('Medior')}</option>
                <option value="Senior">${msg('Senior')}</option>
              </select>
              ${this.errors.position ? html`<div class="form-error">${this.errors.position}</div>` : ''}
            </div>
          </div>

          <div class="form-actions">
            <app-button variant="outline" type="button" id="cancel-button" @click=${this.handleCancel}>
              ${msg('Cancel')}
            </app-button>
            <app-button type="button" id="submit-button" @click=${this.handleSubmit}>
              ${this.mode === 'add' ? msg('Add Employee') : msg('Update Employee')}
            </app-button>
          </div>
        </form>
        </div>
      </div>

      <app-modal
        ?open=${this.showConfirmModal}
        title="${this.mode === 'add' ? msg('Add Employee') : msg('Update Employee')}"
        message="${this.mode === 'add'
          ? msg('Are you sure you want to add this employee?')
          : msg('Are you sure you want to update this employee?')
        }"
        confirmText="${this.mode === 'add' ? msg('Add Employee') : msg('Update Employee')}"
        cancelText="${msg('Cancel')}"
        @modal-closed=${this.handleConfirmSubmit}
      ></app-modal>

    `;
  }
}

customElements.define('employee-form-page', EmployeeFormPage);
