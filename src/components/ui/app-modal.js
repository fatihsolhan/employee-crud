import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { LitElement, css, html } from 'lit';
import './app-button';

export class ModalDialog extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    :host([open]) {
      opacity: 1;
      visibility: visible;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 24px;
      min-width: 400px;
      max-width: 500px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      transform: scale(0.95);
      transition: transform 0.3s ease;
      position: relative;
    }

    :host([open]) .modal-content {
      transform: scale(1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .modal-title {
      font-size: 18px;
      font-weight: 600;
      color: #FF6200;
      margin: 0;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 24px;
      color: #999;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 32px;
      height: 32px;
    }

    .close-button:hover {
      background-color: #f5f5f5;
      color: #666;
    }

    .modal-body {
      margin-bottom: 24px;
      color: #666;
      line-height: 1.5;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    @media (max-width: 480px) {
      .modal-content {
        min-width: auto;
        width: 90vw;
        margin: 20px;
      }

      .modal-actions {
        flex-direction: column-reverse;
      }
    }
  `;

  static properties = {
    open: { type: Boolean, reflect: true },
    title: { type: String },
    message: { type: String },
    confirmText: { type: String },
    cancelText: { type: String },
    type: { type: String }
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.open = false;
    this.title = '';
    this.message = '';
    this.confirmText = msg('Proceed');
    this.cancelText = msg('Cancel');
    this.type = 'confirm';
  }

  updated(changedProperties) {
    if (changedProperties.has('open') && this.open) {
      document.body.style.overflow = 'hidden';
      this.addEventListener('click', this.handleBackdropClick);
    } else if (changedProperties.has('open') && !this.open) {
      document.body.style.overflow = '';
      this.removeEventListener('click', this.handleBackdropClick);
    }
  }

  handleBackdropClick(e) {
    if (e.target === this) {
      this.close(false);
    }
  }

  close(confirmed = false) {
    this.open = false;
    this.dispatchEvent(new CustomEvent('modal-closed', {
      detail: { confirmed },
      bubbles: true,
      composed: true
    }));
  }

  handleConfirm() {
    this.close(true);
  }

  handleCancel() {
    this.close(false);
  }

  render() {
    return html`
      <div class="modal-content" @click=${(e) => e.stopPropagation()}>
        <div class="modal-header">
          <h3 class="modal-title">${this.title}</h3>
          <button class="close-button" @click=${this.handleCancel}>
×
          </button>
        </div>

        <div class="modal-body">
          <p>${this.message}</p>
        </div>

        <div class="modal-actions">
          <app-button variant="outline" @click=${this.handleCancel}>
            ${this.cancelText}
          </app-button>
          <app-button @click=${this.handleConfirm}>
            ${this.confirmText}
          </app-button>
        </div>
      </div>
    `;
  }
}

customElements.define('app-modal', ModalDialog);
