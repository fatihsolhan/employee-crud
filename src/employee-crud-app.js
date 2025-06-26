import { updateWhenLocaleChanges } from '@lit/localize';
import { Router } from '@vaadin/router';
import { LitElement, css, html } from 'lit';
import './components/app-header.js';
import './components/employee-form-page.js';
import './components/employee-list-page.js';
import { setLocale } from './localization.js';
import { appStore } from './services/app-store.js';

class EmployeeCrudApp extends LitElement {

  static styles = css`

    :host {
      display: block;
      min-height: 100vh;
      background-color: #fafafa;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }
    .router-outlet {
      min-height: calc(100vh - 80px);
    }
  `;

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.initializeLocale();
  }

  async initializeLocale() {
    const savedLocale = appStore.getLocale();
    await setLocale(savedLocale);
    this.updateHtmlLang(savedLocale);

    appStore.addEventListener('locale-changed', (e) => {
      this.updateHtmlLang(e.detail);
    });
  }

  updateHtmlLang(locale) {
    document.documentElement.setAttribute('lang', locale);
  }

  firstUpdated() {
    const outlet = this.shadowRoot.querySelector('.router-outlet');
    const router = new Router(outlet);

    router.setRoutes([
      { path: '/', component: 'employee-list-page' },
      { path: '/employee/add', component: 'employee-form-page', action: () => { this.setFormMode('add'); } },
      { path: '/employee/edit/:id', component: 'employee-form-page', action: (context) => { this.setFormMode('edit', context.params.id); } }
    ]);
  }

  setFormMode(mode, id = null) {
    setTimeout(() => {
      const formPage = this.shadowRoot.querySelector('.router-outlet employee-form-page');
      if (formPage) {
        formPage.mode = mode;
        formPage.employeeId = id;
        formPage.requestUpdate();
      }
    }, 0);
  }

  render() {
    return html`
      <app-header></app-header/>
      <div class="router-outlet"></div>
    `;
  }
}

customElements.define('employee-crud-app', EmployeeCrudApp);
