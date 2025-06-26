import { msg, updateWhenLocaleChanges } from "@lit/localize";
import { css, html, LitElement } from "lit";
import { containerStyles, cssVariables, resetCss } from "../styles/shared-styles.js";
import './locale-picker.js';
import './ui/app-button.js';
const logo = new URL('../../assets/logo.svg', import.meta.url).href
export class AppHeader extends LitElement {
  static properties = {
    currentPath: { type: String }
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.currentPath = window.location.pathname;
    this.updateCurrentPath = this.updateCurrentPath.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('popstate', this.updateCurrentPath);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this.updateCurrentPath);
  }

  updateCurrentPath() {
    this.currentPath = window.location.pathname;
  }

  static styles = [
    resetCss,
    containerStyles,
    cssVariables,
    css`
    .app-header {
      padding: 0.25rem 0;
      background-color: #fff;
    }
    .logo {
      display: flex;
      align-items: center;
      text-decoration: none;
    }
    .logo img {
      height: 24px;
      width: auto;
    }

    .logo span {
      margin-left: 0.5rem;
      font-size: 14px;
      color: #000;
      font-weight: 500;
    }
    .app-header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .menu {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .menu a {
      text-decoration: none;
      border-bottom: 1px solid transparent;
    }
    .menu a:not(:hover).active {
      border-bottom-color: var(--primary-color);
    }
    @media (min-width: 640px) {
      .app-header {
        padding: 0.5rem 0;
      }
      .logo img {
        height: 40px;
      }
    }
  `
  ]

  isActivePath(path) {
    if (path === '/') {
      return this.currentPath === '/' || this.currentPath === '';
    }
    return this.currentPath.startsWith(path);
  }

  render() {
    return html`
      <header class="app-header">
        <div class="container">
          <div class="app-header-container">
            <a class="logo" href="/" @click=${this.updateCurrentPath}>
              <img src=${logo} alt="ING Logo" />
              <span>ING</span>
            </a>
            <nav class="menu">
              <a href="/" class="${this.isActivePath('/') ? 'active' : ''}" @click=${this.updateCurrentPath}>
                <app-button variant="ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="currentColor" d="M12 5.5A3.5 3.5 0 0 1 15.5 9a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8.5 9A3.5 3.5 0 0 1 12 5.5M5 8c.56 0 1.08.15 1.53.42c-.15 1.43.27 2.85 1.13 3.96C7.16 13.34 6.16 14 5 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3m14 0a3 3 0 0 1 3 3a3 3 0 0 1-3 3c-1.16 0-2.16-.66-2.66-1.62a5.54 5.54 0 0 0 1.13-3.96c.45-.27.97-.42 1.53-.42M5.5 18.25c0-2.07 2.91-3.75 6.5-3.75s6.5 1.68 6.5 3.75V20h-13zM0 20v-1.5c0-1.39 1.89-2.56 4.45-2.9c-.59.68-.95 1.62-.95 2.65V20zm24 0h-3.5v-1.75c0-1.03-.36-1.97-.95-2.65c2.56.34 4.45 1.51 4.45 2.9z"/></svg>
                  <span>${msg('Employees')}</span>
                </app-button>
              </a>
              <a href="/employee/add" class="${this.isActivePath('/employee/add') ? 'active' : ''}" @click=${this.updateCurrentPath}>
                <app-button variant="ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/></svg>
                  <span>${msg('Add New')}</span>
                </app-button>
              </a>
              <locale-picker></locale-picker>
            </nav>
          </div>
        </div>
      </header>
    `
  }
}

customElements.define('app-header', AppHeader)
