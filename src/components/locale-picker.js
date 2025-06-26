import { updateWhenLocaleChanges } from '@lit/localize';
import { LitElement, css, html } from 'lit';
import { allLocales } from '../locale-codes.js';
import { getLocale, setLocale } from '../localization.js';
import { appStore } from '../services/app-store.js';
import { cssVariables } from '../styles/shared-styles.js';


export class LocalePicker extends LitElement {
  static styles = [cssVariables, css`
    :host {
      display: inline-block;
    }

    .locale-select {
      padding: 0.5rem;
      border: 1px solid #e1e1e1;
      border-radius: 0.5rem;
      font-size: 0.75rem;
      background: white;
      cursor: pointer;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .locale-select:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px var(--primary-color-light);
    }

    .locale-select:hover {
      border-color: #ccc;
    }
    @media (min-width: 640px) {
      .locale-select {
        font-size: 0.875rem;
        padding: 0.5rem 0.75rem;
      }
    }
  `];

  static properties = {
    currentLocale: { type: String }
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.currentLocale = appStore.getLocale();

    appStore.addEventListener('locale-changed', (e) => {
      this.currentLocale = e.detail;
      this.requestUpdate();
    });
  }

  async handleLocaleChange(e) {
    const selectedLocale = e.target.value;
    if (selectedLocale !== getLocale()) {
      appStore.setLocale(selectedLocale);
      await setLocale(selectedLocale);
      this.currentLocale = selectedLocale;
      this.requestUpdate();
    }
  }

  render() {
    return html`
      <select
        class="locale-select"
        .value=${this.currentLocale}
        @change=${this.handleLocaleChange}
      >
        ${allLocales.map(locale => html`
          <option value=${locale} ?selected=${locale === this.currentLocale}>
            ${appStore.getLocaleDisplayName(locale)}
          </option>
        `)}
      </select>
    `;
  }
}
customElements.define('locale-picker', LocalePicker);
