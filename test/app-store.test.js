import { expect } from '@open-wc/testing';
import { appStore } from '../src/services/app-store.js';

describe('AppStore', () => {
  beforeEach(() => {
    localStorage.clear();
    appStore.locale = 'en';
  });

  describe('constructor and initialization', () => {
    it('should initialize with default locale', () => {
      expect(appStore.locale).to.equal('en');
    });

    it('should have supported locales', () => {
      expect(appStore.supportedLocales).to.deep.equal(['en', 'tr']);
    });

    it('should extend EventTarget', () => {
      expect(appStore instanceof EventTarget).to.be.true;
    });
  });

  describe('loadSettings', () => {
    it('should load locale from localStorage', () => {
      const settings = { locale: 'tr' };
      localStorage.setItem('appSettings', JSON.stringify(settings));
      
      appStore.loadSettings();
      
      expect(appStore.locale).to.equal('tr');
    });

    it('should keep current locale when no settings in localStorage', () => {
      appStore.locale = 'tr';
      appStore.loadSettings();
      
      expect(appStore.locale).to.equal('tr');
    });

    it('should use default locale when settings has no locale', () => {
      const settings = { otherSetting: 'value' };
      localStorage.setItem('appSettings', JSON.stringify(settings));
      
      appStore.loadSettings();
      
      expect(appStore.locale).to.equal('en');
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('appSettings', 'invalid-json');
      
      expect(() => appStore.loadSettings()).to.throw();
    });
  });

  describe('saveSettings', () => {
    it('should save locale to localStorage', () => {
      appStore.locale = 'tr';
      appStore.saveSettings();
      
      const saved = JSON.parse(localStorage.getItem('appSettings'));
      expect(saved.locale).to.equal('tr');
    });

    it('should dispatch locale-changed event', (done) => {
      const handler = (event) => {
        expect(event.detail).to.equal('tr');
        appStore.removeEventListener('locale-changed', handler);
        done();
      };
      
      appStore.addEventListener('locale-changed', handler);
      appStore.locale = 'tr';
      appStore.saveSettings();
    });
  });

  describe('getLocale', () => {
    it('should return current locale', () => {
      appStore.locale = 'tr';
      expect(appStore.getLocale()).to.equal('tr');
    });
  });

  describe('setLocale', () => {
    it('should set supported locale and save settings', () => {
      let eventFired = false;
      const handler = () => { eventFired = true; };
      appStore.addEventListener('locale-changed', handler);
      
      appStore.setLocale('tr');
      
      expect(appStore.locale).to.equal('tr');
      expect(eventFired).to.be.true;
      
      const saved = JSON.parse(localStorage.getItem('appSettings'));
      expect(saved.locale).to.equal('tr');
      
      appStore.removeEventListener('locale-changed', handler);
    });

    it('should ignore unsupported locale', () => {
      const originalLocale = appStore.locale;
      
      appStore.setLocale('unsupported');
      
      expect(appStore.locale).to.equal(originalLocale);
      expect(localStorage.getItem('appSettings')).to.be.null;
    });

    it('should not trigger event for unsupported locale', (done) => {
      const handler = () => {
        done(new Error('Event should not be fired for unsupported locale'));
      };
      
      appStore.addEventListener('locale-changed', handler);
      appStore.setLocale('unsupported');
      
      setTimeout(() => {
        appStore.removeEventListener('locale-changed', handler);
        done();
      }, 50);
    });
  });

  describe('getSupportedLocales', () => {
    it('should return copy of supported locales', () => {
      const locales = appStore.getSupportedLocales();
      
      expect(locales).to.deep.equal(['en', 'tr']);
      expect(locales).to.not.equal(appStore.supportedLocales);
    });

    it('should return array that can be modified without affecting original', () => {
      const locales = appStore.getSupportedLocales();
      locales.push('fr');
      
      expect(appStore.supportedLocales).to.deep.equal(['en', 'tr']);
    });
  });

  describe('getLocaleDisplayName', () => {
    it('should return display name for English', () => {
      expect(appStore.getLocaleDisplayName('en')).to.equal('English');
    });

    it('should return display name for Turkish', () => {
      expect(appStore.getLocaleDisplayName('tr')).to.equal('Türkçe');
    });

    it('should return locale code for unknown locale', () => {
      expect(appStore.getLocaleDisplayName('unknown')).to.equal('unknown');
    });

    it('should handle null/undefined locale', () => {
      expect(appStore.getLocaleDisplayName(null)).to.equal(null);
      expect(appStore.getLocaleDisplayName(undefined)).to.equal(undefined);
    });
  });

  describe('event handling', () => {
    it('should support multiple event listeners', (done) => {
      let listener1Called = false;
      let listener2Called = false;
      
      const handler1 = () => { listener1Called = true; };
      const handler2 = () => { 
        listener2Called = true;
        if (listener1Called && listener2Called) {
          appStore.removeEventListener('locale-changed', handler1);
          appStore.removeEventListener('locale-changed', handler2);
          done();
        }
      };
      
      appStore.addEventListener('locale-changed', handler1);
      appStore.addEventListener('locale-changed', handler2);
      
      appStore.setLocale('tr');
    });

    it('should allow removing event listeners', () => {
      let eventCount = 0;
      const handler = () => { eventCount++; };
      
      appStore.addEventListener('locale-changed', handler);
      appStore.setLocale('tr');
      
      appStore.removeEventListener('locale-changed', handler);
      appStore.setLocale('en');
      
      expect(eventCount).to.equal(1);
    });
  });

  describe('persistence across instances', () => {
    it('should maintain settings when reloading', () => {
      appStore.setLocale('tr');
      
      const newAppStore = new (appStore.constructor)();
      
      expect(newAppStore.locale).to.equal('tr');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string locale', () => {
      appStore.setLocale('');
      expect(appStore.locale).to.equal('en');
    });

    it('should handle case sensitivity', () => {
      appStore.setLocale('TR');
      expect(appStore.locale).to.equal('en');
      
      appStore.setLocale('En');
      expect(appStore.locale).to.equal('en');
    });

    it('should handle numeric locale', () => {
      appStore.setLocale(123);
      expect(appStore.locale).to.equal('en');
    });
  });
});