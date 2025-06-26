import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { LitElement, css, html } from 'lit';
import { employeeStore } from '../../services/employee-store.js';
import { cssVariables, resetCss } from '../../styles/shared-styles.js';
import './app-button.js';

export class EmptyState extends LitElement {
  static styles = [
    resetCss,
    cssVariables,
    css`
      .empty-state-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        margin: 3rem auto;
        padding: 2rem;
        text-align: center;
      }

      .empty-state-title {
        font-size: 1.125rem;
        font-weight: 500;
        color: #333;
      }

      .empty-state-description {
        color: #666;
        text-align: center;
        line-height: 1.5;
      }

      .empty-state-actions {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        justify-content: center;
      }
    `
  ];

  constructor() {
    super();
    updateWhenLocaleChanges(this);

    employeeStore.addEventListener('employees-changed', () => {
      this.requestUpdate();
    });

    employeeStore.addEventListener('settings-changed', () => {
      this.requestUpdate();
    });
  }

  handleLoadSampleData() {
    employeeStore.seedData();
  }

  render() {
    const hasSearch = employeeStore.getSearchQuery().trim();
    const hasEmployees = employeeStore.getAllEmployees().length > 0;

    return html`
      <div class="empty-state-content">
        <div class="empty-state-title">
          ${hasSearch ? msg('No employees found') : msg('No employees yet')}
        </div>
        <div class="empty-state-description">
          ${hasSearch
            ? msg('Try adjusting your search criteria or clear the search to see all employees.')
            : msg('Get started by adding your first employee or loading sample data.')
          }
        </div>
        <div class="empty-state-actions">
          <a href="/employee/add">
            <app-button>
              ${msg('Add Employee')}
            </app-button>
          </a>
          ${!hasEmployees ? html`
            <app-button variant="outline" @click=${this.handleLoadSampleData}>
              ${msg('Load Sample Data')}
            </app-button>
          ` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('empty-state', EmptyState);