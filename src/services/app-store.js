class AppStore extends EventTarget {
  constructor() {
    super();
    this.locale = 'en';
    this.supportedLocales = ['en', 'tr'];
    this.loadSettings();
  }

  loadSettings() {
    const settings = localStorage.getItem('appSettings');
    if (settings) {
      const parsed = JSON.parse(settings);
      this.locale = parsed.locale || 'en';
    }
  }

  saveSettings() {
    const settings = {
      locale: this.locale
    };
    localStorage.setItem('appSettings', JSON.stringify(settings));
    this.dispatchEvent(new CustomEvent('locale-changed', { detail: this.locale }));
  }

  getLocale() {
    return this.locale;
  }

  setLocale(locale) {
    if (this.supportedLocales.includes(locale)) {
      this.locale = locale;
      this.saveSettings();
    }
  }

  getSupportedLocales() {
    return [...this.supportedLocales];
  }

  getLocaleDisplayName(locale) {
    const names = {
      'en': 'English',
      'tr': 'Türkçe'
    };
    return names[locale] || locale;
  }
}

export const appStore = new AppStore();