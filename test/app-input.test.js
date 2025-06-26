import { expect, fixture, html } from '@open-wc/testing';
import '../src/components/ui/app-input.js';

describe('AppInput', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<app-input></app-input>`);
  });

  it('should render the component', () => {
    expect(element).to.exist;
  });

  it('should display input element', async () => {
    await element.updateComplete;
    const input = element.shadowRoot.querySelector('input');
    expect(input).to.exist;
  });

  it('should have default properties', () => {
    expect(element.type).to.equal('text');
    expect(element.value).to.equal('');
    expect(element.required).to.be.false;
    expect(element.disabled).to.be.false;
  });

  describe('input properties', () => {
    it('should set input type', async () => {
      element.type = 'email';
      await element.updateComplete;

      const input = element.shadowRoot.querySelector('input');
      expect(input.type).to.equal('email');
    });

    it('should set input value', async () => {
      element.value = 'test value';
      await element.updateComplete;

      const input = element.shadowRoot.querySelector('input');
      expect(input.value).to.equal('test value');
    });

    it('should set input placeholder', async () => {
      element.placeholder = 'Enter text here';
      await element.updateComplete;

      const input = element.shadowRoot.querySelector('input');
      expect(input.placeholder).to.equal('Enter text here');
    });

    it('should set required attribute', async () => {
      element.required = true;
      await element.updateComplete;

      const input = element.shadowRoot.querySelector('input');
      expect(input.required).to.be.true;
    });

    it('should set disabled attribute', async () => {
      element.disabled = true;
      await element.updateComplete;

      const input = element.shadowRoot.querySelector('input');
      expect(input.disabled).to.be.true;
    });
  });

  describe('label rendering', () => {
    it('should not render label when label prop is empty', async () => {
      await element.updateComplete;
      const label = element.shadowRoot.querySelector('label');
      expect(label).to.not.exist;
    });

    it('should render label when label prop is set', async () => {
      element.label = 'Test Label';
      await element.updateComplete;

      const label = element.shadowRoot.querySelector('label');
      expect(label).to.exist;
      expect(label.textContent).to.equal('Test Label');
    });

    it('should render required asterisk for required fields with " *" in label', async () => {
      element.label = 'Required Field *';
      await element.updateComplete;

      const label = element.shadowRoot.querySelector('label');
      const requiredSpan = label.querySelector('.required');
      expect(requiredSpan).to.exist;
      expect(requiredSpan.textContent).to.equal('*');
    });

    it('should handle label without required marker', async () => {
      element.label = 'Optional Field';
      await element.updateComplete;

      const label = element.shadowRoot.querySelector('label');
      const requiredSpan = label.querySelector('.required');
      expect(requiredSpan).to.not.exist;
      expect(label.textContent).to.equal('Optional Field');
    });
  });

  describe('input events', () => {
    it('should dispatch app-input-change event on input', async () => {
      await element.updateComplete;

      let eventFired = false;
      let eventValue = null;

      element.addEventListener('app-input-change', (e) => {
        eventFired = true;
        eventValue = e.detail.value;
      });

      const input = element.shadowRoot.querySelector('input');
      input.value = 'test input';
      input.dispatchEvent(new Event('input'));

      expect(eventFired).to.be.true;
      expect(eventValue).to.equal('test input');
    });

    it('should dispatch event with bubbles and composed', async () => {
      await element.updateComplete;

      let event = null;
      element.addEventListener('app-input-change', (e) => {
        event = e;
      });

      const input = element.shadowRoot.querySelector('input');
      input.value = 'test';
      input.dispatchEvent(new Event('input'));

      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });
  });

  describe('error state', () => {
    it('should apply error class when host has error class', async () => {
      element.classList.add('error');
      await element.updateComplete;

      const styles = element.constructor.styles;
      const cssText = styles.toString();
      expect(cssText).to.include(':host(.error)');
    });
  });

  describe('responsive design', () => {
    it('should have responsive CSS for mobile', () => {
      const styles = element.constructor.styles;
      const cssText = styles.toString();

      expect(cssText).to.include('@media (max-width: 480px)');
      expect(cssText).to.include('font-size: 16px');
    });
  });

  describe('styling', () => {
    it('should have proper CSS styles', () => {
      const styles = element.constructor.styles;
      expect(styles).to.exist;

      const cssText = styles.toString();
      expect(cssText).to.include('.input-container');
      expect(cssText).to.include('.input');
      expect(cssText).to.include('.label');
    });

    it('should have focus styles', () => {
      const styles = element.constructor.styles;
      const cssText = styles.toString();

      expect(cssText).to.include(':focus');
      expect(cssText).to.include('box-shadow');
    });

    it('should have disabled styles', () => {
      const styles = element.constructor.styles;
      const cssText = styles.toString();

      expect(cssText).to.include(':disabled');
      expect(cssText).to.include('cursor: not-allowed');
    });
  });

  describe('different input types', () => {
    it('should work with email type', async () => {
      element.type = 'email';
      element.value = 'test@example.com';
      await element.updateComplete;

      const input = element.shadowRoot.querySelector('input');
      expect(input.type).to.equal('email');
      expect(input.value).to.equal('test@example.com');
    });

    it('should work with password type', async () => {
      element.type = 'password';
      element.value = 'secret';
      await element.updateComplete;

      const input = element.shadowRoot.querySelector('input');
      expect(input.type).to.equal('password');
      expect(input.value).to.equal('secret');
    });

    it('should work with date type', async () => {
      element.type = 'date';
      element.value = '2023-01-01';
      await element.updateComplete;

      const input = element.shadowRoot.querySelector('input');
      expect(input.type).to.equal('date');
      expect(input.value).to.equal('2023-01-01');
    });
  });

  describe('static properties', () => {
    it('should have proper static properties defined', () => {
      const properties = element.constructor.properties;
      expect(properties).to.exist;
      expect(properties.label).to.exist;
      expect(properties.type).to.exist;
      expect(properties.placeholder).to.exist;
      expect(properties.value).to.exist;
      expect(properties.required).to.exist;
      expect(properties.disabled).to.exist;
    });
  });
});
