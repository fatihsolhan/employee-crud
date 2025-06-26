import { msg, str, updateWhenLocaleChanges } from "@lit/localize";
import { css, html, LitElement } from "lit";
import { employeeStore } from "../../services/employee-store";
import '../ui/app-button';

export class EmployeesPagination extends LitElement {
  static properties = {
    itemsPerPageOptions: { type: Array }
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.itemsPerPageOptions = [5, 10, 20, 50];

    employeeStore.addEventListener('settings-changed', () => {
      this.requestUpdate();
    });

    employeeStore.addEventListener('employees-changed', () => {
      this.requestUpdate();
    });
  }

  get totalPages() {
    return Math.ceil(employeeStore.getFilteredEmployees().length / employeeStore.getItemsPerPage());
  }

  get paginationInfo() {
    const filteredEmployees = employeeStore.getFilteredEmployees().length;
    const info = employeeStore.getPaginationInfo(filteredEmployees);
    return msg(str`${info.start}-${info.end} of ${info.total}`, {
      desc: 'Pagination info showing current range and total count'
    });
  }

  static styles = css`
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .pagination-left {
      display: flex;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .pagination-info {
      color: #6E6E6E;
      font-size: 14px;
      white-space: nowrap;
    }

    .items-per-page {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #6E6E6E;
      font-size: 14px;
      white-space: nowrap;
    }

    .items-per-page select {
      padding: 0.25rem 0.5rem;
      border: 1px solid #e1e1e1;
      border-radius: 0.25rem;
      background: white;
      min-width: 60px;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .pagination {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 0.5rem;
        margin-top: 1rem;
      }

      .pagination-left {
        width: 100%;
        justify-content: space-between;
        gap: 1rem;
      }

      .pagination-info,
      .items-per-page {
        font-size: 13px;
      }

      .pagination-controls {
        justify-content: center;
        width: 100%;
        max-width: 100%;
        overflow-x: auto;
        padding: 0.5rem 0;
      }

      .pagination-controls::-webkit-scrollbar {
        display: none;
      }

      .pagination-controls {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    }

    @media (max-width: 480px) {
      .pagination-left {
        gap: 1rem;
        width: 100%;
      }

      .pagination-info,
      .items-per-page {
        font-size: 12px;
      }

      .pagination-controls {
        gap: 0.125rem;
        padding: 0.25rem 1rem;
        margin: 0 -1rem;
      }

      .pagination-controls app-button {
        min-width: 36px;
        height: 36px;
      }
    }
  `;

  handlePageChange(page) {
    if (page >= 1 && page <= this.totalPages) {
      employeeStore.setCurrentPage(page);
      this.requestUpdate();
    }
  }

  handleItemsPerPageChange(e) {
    const value = parseInt(e.target.value);
    employeeStore.setItemsPerPage(value);
    this.requestUpdate();
  }

  render() {
    if (this.totalPages <= 1) return '';

    const currentPage = employeeStore.getCurrentPage();
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return html`
      <div class="pagination">
        <div class="pagination-left">
          <div class="pagination-info">
            ${this.paginationInfo}
          </div>
          <div class="items-per-page">
            <span>${msg('Show')}:</span>
            <select .value=${employeeStore.getItemsPerPage().toString()} @change=${this.handleItemsPerPageChange}>
              ${this.itemsPerPageOptions.map(option => html`
                <option value=${option.toString()} ?selected=${employeeStore.getItemsPerPage() === option}>${option}</option>
              `)}
            </select>
          </div>
        </div>

        <div class="pagination-controls">
          <app-button
            variant="circle"
            ?disabled=${currentPage === 1}
            @click=${() => this.handlePageChange(currentPage - 1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="currentColor" d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6l6 6z"/></svg>
          </app-button>

          ${pages.map(page => html`
            <app-button
              variant=${currentPage === page ? 'circle-active' : 'circle'}
              @click=${() => this.handlePageChange(page)}
            >
              ${page}
            </app-button>
          `)}

          <app-button
            variant="circle"
            ?disabled=${currentPage === this.totalPages}
            @click=${() => this.handlePageChange(currentPage + 1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="currentColor" d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6z"/></svg>
          </app-button>
        </div>
      </div>
    `;
  }
}

customElements.define('employees-pagination', EmployeesPagination);
