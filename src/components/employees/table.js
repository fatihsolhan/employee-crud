import { msg, updateWhenLocaleChanges } from "@lit/localize";
import { css, html, LitElement } from "lit";
import { employeeStore } from "../../services/employee-store";
import { cssVariables, resetCss } from "../../styles/shared-styles.js";
import { formatDate } from "../../utils/date-formatter";
import '../ui/app-button';
import '../ui/app-checkbox';
export class EmployeesTable extends LitElement {
  static styles = [
    resetCss,
    cssVariables,
    css`
      .table-container {
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        border-radius: 0.5rem;
        background-color: white;
      }

      table {
        background-color: white;
        width: 100%;
        border-collapse: collapse;
      }

      th, td {
        padding: 1.5rem 0;
        text-align: center;
        white-space: nowrap;
      }

      th {
        color: var(--primary-color);
        font-weight: normal;
        font-size: 14px;
        min-width: 120px;
      }

      tbody tr {
        border-top: 1px solid #f5f5f5;
      }

      th:first-child, td:first-child {
        padding-left: 1rem;
        min-width: 60px;
        position: sticky;
        left: 0;
        background-color: white;
        z-index: 1;
      }

      th:last-child, td:last-child {
        padding-right: 1rem;
        min-width: 100px;
        position: sticky;
        right: 0;
        background-color: white;
        z-index: 1;
      }

      td {
        color: #6E6E6E;
        font-size: 15px;
      }

      td.first-name,
      td.last-name {
        color: #050A12;
        font-weight: 500;
        min-width: 150px;
      }

      td .actions-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      td .actions-wrapper a,
      td .actions-wrapper button {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        flex-shrink: 0;
        width: 2rem;
        height: 2rem;
        color: var(--primary-color);
      }

      td .actions-wrapper a {
        text-decoration: none;
        padding: 0.25rem;
        margin: -0.25rem;
      }

      td .actions-wrapper a:hover,
      td .actions-wrapper button:hover{
        background: var(--primary-color-light);
      }
      @media (max-width: 768px) {
        th, td {
          padding: 1rem 0.5rem;
          font-size: 14px;
        }

        th:first-child, td:first-child {
          padding-left: 1rem;
        }

        th:last-child, td:last-child {
          padding-right: 1rem;
        }

        table {
          min-width: 1000px;
        }
      }

      @media (max-width: 480px) {
        th, td {
          padding: 0.75rem 0.25rem;
          font-size: 13px;
        }

        th:first-child, td:first-child {
          padding-left: 0.5rem;
        }

        th:last-child, td:last-child {
          padding-right: 0.5rem;
        }
      }
    `
  ]

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

  seedEmployees() {
    employeeStore.seedData()
  }

  handleHeaderCheckboxChange() {
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
    const hasSearch = employeeStore.getSearchQuery().trim();
    const hasEmployees = employeeStore.getAllEmployees().length > 0;

    return html`
      <tr>
        <td colspan="10" style="text-align: center; padding: 3rem 1rem;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; max-width: 400px; margin: 0 auto;">
            <div style="font-size: 1.125rem; font-weight: 500; color: #333;">
              ${hasSearch ? msg('No employees found') : msg('No employees yet')}
            </div>
            <div style="color: #666; text-align: center; line-height: 1.5;">
              ${hasSearch
                ? msg('Try adjusting your search criteria or clear the search to see all employees.')
                : msg('Get started by adding your first employee or loading sample data.')
              }
            </div>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;">
              <app-button @click=${() => window.location.href = '/employee/add'}>
                ${msg('Add Employee')}
              </app-button>
              ${!hasEmployees ? html`
                <app-button variant="outline" @click=${() => employeeStore.seedData()}>
                  ${msg('Load Sample Data')}
                </app-button>
              ` : ''}
            </div>
          </div>
        </td>
      </tr>
    `
  }

  renderEmployeesView() {
    const paginatedEmployees = employeeStore.getPaginatedEmployees();
    return html`
    ${paginatedEmployees.map(employee => {
      return html`
        <tr>
          <td>
            <app-checkbox
              .checked=${employeeStore.isEmployeeSelected(employee.id)}
              @change=${() => this.handleEmployeeCheckboxChange(employee)}
            ></app-checkbox>
          </td>
          <td class="first-name">${employee.firstName}</td>
                <td class="last-name">${employee.lastName}</td>
                <td>${formatDate(employee.dateOfEmployment)}</td>
                <td>${formatDate(employee.dateOfBirth)}</td>
                <td>${employee.phone}</td>
                <td>${employee.email}</td>
                <td>${employee.department}</td>
                <td>${employee.position}</td>
                <td class="actions">
                  <div class="actions-wrapper">
                    <a href="/employee/edit/${employee.id}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="currentColor" d="M19 19V5H5v14zm0-16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-2.3 6.35l-1 1l-2.05-2.05l1-1c.21-.22.56-.22.77 0l1.28 1.28c.22.21.22.56 0 .77M7 14.94l6.06-6.06l2.06 2.06L9.06 17H7z"/></svg>
                    </a>
                    <button @click=${() => this.handleDeleteEmployee(employee)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"/></svg>
                    </button>
                  </div>
                </td>
        </tr>`
    })}
    `
  }

  render() {
    return html`

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>
                  <app-checkbox
                    .checked=${employeeStore.getSelectionState() === 'all'}
                    .indeterminate=${employeeStore.getSelectionState() === 'some'}
                    @change=${this.handleHeaderCheckboxChange}
                  ></app-checkbox>
                </th>
                <th>${msg('First Name')}</th>
                <th>${msg('Last Name')}</th>
                <th>${msg('Date of Employment')}</th>
                <th>${msg('Date of Birth')}</th>
                <th>${msg('Phone')}</th>
                <th>${msg('Email')}</th>
                <th>${msg('Department')}</th>
                <th>${msg('Position')}</th>
                <th>${msg('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              ${employeeStore.getPaginatedEmployees().length === 0 ?
    this.renderEmptyView()
              : this.renderEmployeesView()
              }
            </tbody>
          </table>
      </div>
    `
  }
}
customElements.define('employees-table', EmployeesTable)
