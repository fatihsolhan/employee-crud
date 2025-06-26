import { msg, updateWhenLocaleChanges } from "@lit/localize";
import { css, html, LitElement } from "lit";
import { employeeStore } from "../../services/employee-store";
import { resetCss } from "../../styles/shared-styles";
import '../delete-employees';
import '../ui/app-button';
import '../ui/app-input';
import './list';
import './pagination';
import './table';

export class EmployeesView extends LitElement {
  static styles = [
    resetCss,
    css`
      :host {
        display: block;
      }

      .view-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        gap: 1rem;
      }

      .search-container {
        flex: 1;
        max-width: 400px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .search-container app-input {
        width: 100%;
      }

      .view-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-shrink: 0;
      }

      .delete-btn {
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }



      @media (max-width: 768px) {
        .view-header {
          gap: 0.75rem;
          align-items: baseline;
        }



        .delete-btn {
          justify-content: center;
        }
      }

      @media (max-width: 480px) {
        .view-header {
          padding: 0;
          gap: 0.5rem;
        }


        .view-controls {
          gap: 0.25rem;
        }

        .search-container {
          max-width: none;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.75rem;
        }
      }
    `
  ];

  static properties = {
    viewMode: { type: String },
    searchQuery: { type: String },
    selectedCount: { type: Number },
    showDeleteModal: { type: Boolean },
    deleteEmployeeIds: { type: Array }
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.viewMode = employeeStore.getViewMode();
    this.searchQuery = employeeStore.getSearchQuery();
    this.selectedCount = employeeStore.getSelectedCount();
    this.showDeleteModal = false;
    this.deleteEmployeeIds = [];

    employeeStore.addEventListener('settings-changed', () => {
      this.viewMode = employeeStore.getViewMode();
      this.searchQuery = employeeStore.getSearchQuery();
      this.requestUpdate();
    });

    employeeStore.addEventListener('selection-changed', () => {
      this.selectedCount = employeeStore.getSelectedCount();
      this.requestUpdate();
    });

    employeeStore.addEventListener('employees-changed', () => {
      this.requestUpdate();
    });

    this.addEventListener('employee-delete', (e) => {
      this.handleEmployeeDelete(e.detail.employee);
    });
  }

  handleViewModeChange(mode) {
    employeeStore.setViewMode(mode);
  }

  handleSearchChange(e) {
    const query = e.detail ? e.detail.value : e.target.value;
    employeeStore.setSearchQuery(query);
  }

  handleDeleteSelected() {
    this.deleteEmployeeIds = Array.from(employeeStore.selectedEmployeeIds);
    this.showDeleteModal = true;
  }

  handleEmployeeDelete(employee) {
    this.deleteEmployeeIds = [employee.id];
    this.showDeleteModal = true;
  }

  handleDeleteClosed() {
    this.showDeleteModal = false;
    this.deleteEmployeeIds = [];
  }

  render() {
    return html`
      <div class="view-header">
        <div class="search-container">
          <app-input
            placeholder="${msg('Search employees...')}"
            .value=${this.searchQuery}
            @app-input-change=${this.handleSearchChange}
          ></app-input>
          ${this.selectedCount > 0 ? html`
            <app-button
              variant="outline"
              class="delete-btn"
              @click=${this.handleDeleteSelected}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <rect width="24" height="24" fill="none"/>
                <path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"/>
              </svg>
              ${msg('Delete Employees')} (${this.selectedCount})
            </app-button>
          ` : ''}
        </div>
        <div class="view-controls">
          <app-button
            variant=${this.viewMode === 'table' ? 'circle-active' : 'circle'}
            @click=${() => this.handleViewModeChange('table')}
            title="${msg('Table View')}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
              <rect width="256" height="256" fill="none"/>
              <path fill="currentColor" d="M222 128a6 6 0 0 1-6 6H40a6 6 0 0 1 0-12h176a6 6 0 0 1 6 6M40 70h176a6 6 0 0 0 0-12H40a6 6 0 0 0 0 12m176 116H40a6 6 0 0 0 0 12h176a6 6 0 0 0 0-12"/>
            </svg>
          </app-button>
          <app-button
            variant=${this.viewMode === 'list' ? 'circle-active' : 'circle'}
            @click=${() => this.handleViewModeChange('list')}
            title="${msg('List View')}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
              <rect width="256" height="256" fill="none"/>
              <rect x="48" y="48" width="64" height="64" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"/>
              <rect x="144" y="48" width="64" height="64" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"/>
              <rect x="48" y="144" width="64" height="64" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"/>
              <rect x="144" y="144" width="64" height="64" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"/>
            </svg>
          </app-button>
        </div>
      </div>

      ${this.viewMode === 'table'
        ? html`<employees-table></employees-table>`
        : html`<employees-list></employees-list>`
      }

      <employees-pagination></employees-pagination>

      <delete-employees
        .employeeIds=${this.deleteEmployeeIds}
        .open=${this.showDeleteModal}
        @delete-closed=${this.handleDeleteClosed}
      ></delete-employees>
    `;
  }
}

customElements.define('employees-view', EmployeesView);
