import { css, html, LitElement } from "lit";
import { cssVariables } from "../../styles/shared-styles.js";

export class AppButton extends LitElement {
  static properties = {
    variant: { type: String },
    disabled: { type: Boolean },
    type: { type: String }
  };

  constructor() {
    super();
    this.variant = 'default';
    this.disabled = false;
    this.type = 'button';
  }

  static styles = [
    cssVariables,
    css`
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      padding: 0 0.75rem;
      border-radius: 0.5rem;
      border: 1px solid transparent;
      cursor: pointer;
      height: 40px;
      gap: 0.25rem;
    }

    button.default {
      color: white;
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }

    button.default:hover:not(:disabled) {
      background-color: #e55500;
      border-color: #e55500;
    }

    button.outline {
      color: var(--primary-color);
      background-color: transparent;
      border-color: var(--primary-color);
    }

    button.outline:hover:not(:disabled) {
      background-color: var(--primary-color);
      color: white;
    }

    button.ghost {
      color: var(--primary-color);
      background-color: transparent;
      border-color: transparent;
    }

    button.ghost:hover:not(:disabled) {
      background-color: var(--primary-color-light);
      color: var(--primary-color);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    button.default:disabled {
      background-color: #cccccc;
      border-color: #cccccc;
      color: #888888;
    }

    button.outline:disabled {
      border-color: #cccccc;
      color: #888888;
    }

    button.ghost:disabled {
      color: #cccccc;
    }

    button.circle {
      width: 40px;
      height: 40px;
      min-width: 40px;
      border-radius: 50%;
      padding: 0;
      color: #6E6E6E;
      background-color: transparent;
    }

    button.circle:hover:not(:disabled) {
      background-color: #f5f5f5;
      color: var(--primary-color);
    }

    button.circle:disabled {
      color: #cccccc;
    }

    button.circle-active {
      width: 40px;
      height: 40px;
      min-width: 40px;
      border-radius: 50%;
      padding: 0;
      color: white;
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }

    button.circle-active:hover:not(:disabled) {
      background-color: #e55500;
      border-color: #e55500;
    }

    button svg {
      width: 16px;
      height: 16px;
    }
  `
  ]

  render() {
    return html`
      <button class="${this.variant}" ?disabled=${this.disabled} type="${this.type}">
        <slot></slot>
      </button>
    `
  }
}
customElements.define('app-button', AppButton)
