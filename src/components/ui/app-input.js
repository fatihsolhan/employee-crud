import { css, html, LitElement } from "lit";
import { cssVariables, resetCss } from "../../styles/shared-styles.js";

export class AppInput extends LitElement {
  static styles = [
    resetCss,
    cssVariables,
    css`
      .input-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .label {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }

      .required {
        color: #dc2626;
      }

      .input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #e1e1e1;
        border-radius: 0.5rem;
        font-size: 14px;
        background: white;
        box-sizing: border-box;
      }

      .input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px var(--primary-color-light);
      }

      .input:disabled {
        background-color: #f5f5f5;
        color: #999;
        cursor: not-allowed;
      }

      :host(.error) .input {
        border-color: #dc2626 !important;
      }

      :host(.error) .input:focus {
        border-color: #dc2626 !important;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
      }

      @media (max-width: 480px) {
        .input {
          font-size: 16px;
          padding: 0.65rem 0.85rem;
        }
      }
    `
  ];

  static properties = {
    label: { type: String },
    type: { type: String },
    placeholder: { type: String },
    value: { type: String },
    required: { type: Boolean },
    disabled: { type: Boolean }
  };

  constructor() {
    super();
    this.type = 'text';
    this.value = '';
    this.required = false;
    this.disabled = false;
  }

  handleInput(e) {
    const value = e.target.value;
    this.dispatchEvent(new CustomEvent('app-input-change', {
      detail: { value },
      bubbles: true,
      composed: true
    }));
  }

  renderLabel() {
    if (!this.label) return '';

    const labelParts = this.label.split(' *');
    if (labelParts.length === 2) {
      return html`<label class="label">${labelParts[0]} <span class="required">*</span></label>`;
    }
    return html`<label class="label">${this.label}</label>`;
  }

  render() {
    return html`
      <div class="input-container">
        ${this.renderLabel()}
        <input
          type="${this.type}"
          class="input"
          placeholder="${this.placeholder || ''}"
          .value=${this.value || ''}
          ?required=${this.required}
          ?disabled=${this.disabled}
          @input=${this.handleInput}
        />
      </div>
    `;
  }
}

customElements.define('app-input', AppInput);
