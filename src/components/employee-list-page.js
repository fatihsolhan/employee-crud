import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { LitElement, css, html } from 'lit';
import { containerStyles, cssVariables, resetCss } from '../styles/shared-styles.js';
import './employees/view.js';

export class EmployeeListPage extends LitElement {
  static styles = [
    resetCss,
    containerStyles,
    cssVariables,
    css`
      .page-header {
        padding: 2rem 0;
      }
      h1 {
        color: var(--primary-color);
        font-size: 1.75rem;
      }
    `
  ];

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {
    return html`
    <div class="container">
      <div class="page-header">
        <h1>${msg('Employee List')}</h1>
      </div>
      <employees-view></employees-view>
    </div>
    `;
  }
}

customElements.define('employee-list-page', EmployeeListPage);
