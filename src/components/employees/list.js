import { msg, updateWhenLocaleChanges } from "@lit/localize";
import { css, html, LitElement } from "lit";
import { employeeStore } from "../../services/employee-store.js";
import { cssVariables, resetCss } from "../../styles/shared-styles.js";
import { formatDate } from "../../utils/date-formatter.js";
import '../ui/app-button.js';
import '../ui/app-checkbox.js';
import '../ui/empty-state.js';

export class EmployeesList extends LitElement {
  static styles = [
    resetCss,
    cssVariables,
    css`
      .list-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .employee-card {
        background: white;
        border-radius: 0.75rem;
        padding: 1.5rem;
        border: 1px solid #f0f0f0;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .card-checkbox {
        margin-top: 0.25rem;
      }

      .employee-name {
        font-size: 1.125rem;
        font-weight: 600;
        color: #050A12;
        margin-bottom: 0.25rem;
      }

      .employee-position {
        color: var(--primary-color);
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
      }

      .employee-department {
        color: #6E6E6E;
        font-size: 0.875rem;
        background: #f8f9fa;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        display: inline-block;
        margin-bottom: 1rem;
      }

      .card-details {
        display: grid;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #f5f5f5;
      }

      .detail-row:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .detail-label {
        color: #6E6E6E;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 500;
      }

      .detail-value {
        color: #050A12;
        font-size: 0.875rem;
        font-weight: 500;
        text-align: right;
      }

      .card-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
      }

      .action-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: var(--primary-color);
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .action-button:hover {
        background: var(--primary-color-light);
      }


      .list-header {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-bottom: 1rem;
        padding: 0 0.5rem;
      }

      @media (max-width: 768px) {
        .list-container {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        .employee-card {
          padding: 1.25rem;
        }

        .employee-name {
          font-size: 1rem;
        }
      }

      @media (max-width: 480px) {
        .employee-card {
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .card-details {
          gap: 0.5rem;
        }

        .detail-row {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }

        .detail-value {
          text-align: left;
        }
      }
    `
  ];
  constructor() {
    super();
    updateWhenLocaleChanges(this);
    
    employeeStore.addEventListener('settings-changed', () => {
      this.requestUpdate();
    });

    employeeStore.addEventListener('selection-changed', () => {
      this.requestUpdate();
    });

    employeeStore.addEventListener('employees-changed', () => {
      this.requestUpdate();
    });
  }

  handleSelectAll() {
    const state = employeeStore.getSelectionState();
    if (state === 'all') {
      employeeStore.clearSelection();
    } else {
      employeeStore.selectAllVisible();
    }
  }

  handleEmployeeCheckboxChange(employee) {
    employeeStore.toggleEmployeeSelection(employee.id);
  }

  handleDeleteEmployee(employee) {
    this.dispatchEvent(new CustomEvent('employee-delete', {
      detail: { employee },
      bubbles: true,
      composed: true
    }));
  }

  renderEmptyView() {
    return html`<empty-state></empty-state>`;
  }

  renderEmployeeCard(employee) {
    return html`
      <div class="employee-card">
        <div class="card-header">
          <div>
            <div class="employee-name">
              ${employee.firstName} ${employee.lastName}
            </div>
            <div class="employee-position">${employee.position}</div>
            <div class="employee-department">${employee.department}</div>
          </div>
          <div class="card-checkbox">
            <app-checkbox
              .checked=${employeeStore.isEmployeeSelected(employee.id)}
              @change=${() => this.handleEmployeeCheckboxChange(employee)}
            ></app-checkbox>
          </div>
        </div>

        <div class="card-details">
          <div class="detail-row">
            <span class="detail-label">${msg('Employment Date')}</span>
            <span class="detail-value">${formatDate(employee.dateOfEmployment)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${msg('Date of Birth')}</span>
            <span class="detail-value">${formatDate(employee.dateOfBirth)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${msg('Phone')}</span>
            <span class="detail-value">${employee.phone}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${msg('Email')}</span>
            <span class="detail-value">${employee.email}</span>
          </div>
        </div>

        <div class="card-actions">
          <a href="/employee/edit/${employee.id}" class="action-button" title="${msg('Edit Employee')}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <rect width="24" height="24" fill="none"/>
              <path fill="currentColor" d="M19 19V5H5v14zm0-16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-2.3 6.35l-1 1l-2.05-2.05l1-1c.21-.22.56-.22.77 0l1.28 1.28c.22.21.22.56 0 .77M7 14.94l6.06-6.06l2.06 2.06L9.06 17H7z"/>
            </svg>
          </a>
          <button class="action-button" title="${msg('Delete Employee')}" @click=${() => this.handleDeleteEmployee(employee)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <rect width="24" height="24" fill="none"/>
              <path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  render() {
    const paginatedEmployees = employeeStore.getPaginatedEmployees();

    if (paginatedEmployees.length === 0) {
      return this.renderEmptyView();
    }

    const selectionState = employeeStore.getSelectionState();

    return html`
      <div class="list-header">
        <app-button variant="ghost" @click=${this.handleSelectAll}>
          <app-checkbox
            .checked=${selectionState === 'all'}
            .indeterminate=${selectionState === 'some'}
          ></app-checkbox>
          <span>
            ${selectionState === 'all'
              ? msg('Deselect All')
              : msg('Select All')
            }
          </span>
        </app-button>
      </div>

      <div class="list-container">
        ${paginatedEmployees.map(employee => this.renderEmployeeCard(employee))}
      </div>
    `;
  }
}

customElements.define('employees-list', EmployeesList);
