import { css, html, LitElement } from "lit";
import { cssVariables } from "../../styles/shared-styles.js";

export class AppCheckbox extends LitElement {
  static properties = {
    checked: { type: Boolean },
    indeterminate: { type: Boolean }
  };

  constructor() {
    super();
    this.checked = false;
    this.indeterminate = false;
  }

  static styles = [
    cssVariables,
    css`
    :host {
      display: inline-block;
    }

    .checkbox-container {
      position: relative;
      display: inline-block;
      cursor: pointer;
    }

    .checkbox {
      width: 16px;
      height: 16px;
      border: 2px solid #ddd;
      border-radius: 4px;
      background-color: white;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .checkbox:hover {
      border-color: var(--primary-color);
    }

    .checkbox.checked,
    .checkbox.indeterminate {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }

    .checkmark {
      width: 10px;
      height: 10px;
    }

    .indeterminate-mark {
      width: 8px;
      height: 2px;
      background-color: white;
      border-radius: 1px;
    }

    input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
  `]

  handleChange(e) {
    this.checked = e.target.checked;
    this.indeterminate = false;

    this.dispatchEvent(new CustomEvent('change', {
      detail: { checked: this.checked },
      bubbles: true
    }));
  }

  render() {
    return html`
      <label class="checkbox-container">
        <input
          type="checkbox"
          .checked=${this.checked}
          @change=${this.handleChange}
        />
        <div class="checkbox ${this.checked ? 'checked' : ''} ${this.indeterminate ? 'indeterminate' : ''}">
          <div class="indeterminate-mark" style="${this.indeterminate ? '' : 'display: none;'}"></div>
          <svg class="checkmark" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="${this.checked && !this.indeterminate ? '' : 'display: none;'}">
            <path d="M13 4L6 11l-3-3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </label>
    `;
  }
}

customElements.define('app-checkbox', AppCheckbox);
