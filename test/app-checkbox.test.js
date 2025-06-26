import { expect, fixture, html } from '@open-wc/testing';
import '../src/components/ui/app-checkbox.js';

describe('AppCheckbox', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<app-checkbox></app-checkbox>`);
  });

  it('should render the component', () => {
    expect(element).to.exist;
  });

  it('should display checkbox container', async () => {
    await element.updateComplete;
    const container = element.shadowRoot.querySelector('.checkbox-container');
    expect(container).to.exist;
  });

  it('should display hidden native input', async () => {
    await element.updateComplete;
    const input = element.shadowRoot.querySelector('input[type="checkbox"]');
    expect(input).to.exist;
  });

  it('should display custom checkbox visual', async () => {
    await element.updateComplete;
    const checkbox = element.shadowRoot.querySelector('.checkbox');
    expect(checkbox).to.exist;
  });

  it('should have default properties', () => {
    expect(element.checked).to.be.false;
    expect(element.indeterminate).to.be.false;
  });

  describe('checked state', () => {
    it('should apply checked class when checked', async () => {
      element.checked = true;
      await element.updateComplete;

      const checkbox = element.shadowRoot.querySelector('.checkbox');
      expect(checkbox.classList.contains('checked')).to.be.true;
    });

    it('should set native input checked property', async () => {
      element.checked = true;
      await element.updateComplete;

      const input = element.shadowRoot.querySelector('input');
      expect(input.checked).to.be.true;
    });

    it('should show checkmark when checked', async () => {
      element.checked = true;
      element.indeterminate = false;
      await element.updateComplete;

      const checkmark = element.shadowRoot.querySelector('.checkmark');
      expect(checkmark).to.exist;
      expect(checkmark.style.display).to.not.equal('none');
    });

    it('should hide checkmark when not checked', async () => {
      element.checked = false;
      await element.updateComplete;

      const checkmark = element.shadowRoot.querySelector('.checkmark');
      expect(checkmark.style.display).to.equal('none');
    });
  });

  describe('indeterminate state', () => {
    it('should apply indeterminate class when indeterminate', async () => {
      element.indeterminate = true;
      await element.updateComplete;

      const checkbox = element.shadowRoot.querySelector('.checkbox');
      expect(checkbox.classList.contains('indeterminate')).to.be.true;
    });

    it('should show indeterminate mark when indeterminate', async () => {
      element.indeterminate = true;
      await element.updateComplete;

      const indeterminateMark = element.shadowRoot.querySelector('.indeterminate-mark');
      expect(indeterminateMark.style.display).to.not.equal('none');
    });

    it('should hide indeterminate mark when not indeterminate', async () => {
      element.indeterminate = false;
      await element.updateComplete;

      const indeterminateMark = element.shadowRoot.querySelector('.indeterminate-mark');
      expect(indeterminateMark.style.display).to.equal('none');
    });

    it('should hide checkmark when indeterminate', async () => {
      element.checked = true;
      element.indeterminate = true;
      await element.updateComplete;

      const checkmark = element.shadowRoot.querySelector('.checkmark');
      expect(checkmark.style.display).to.equal('none');
    });
  });

  describe('change events', () => {
    it('should handle native checkbox change', async () => {
      await element.updateComplete;

      let eventFired = false;
      let eventChecked = null;

      element.addEventListener('change', (e) => {
        eventFired = true;
        eventChecked = e.detail.checked;
      });

      const input = element.shadowRoot.querySelector('input');
      input.checked = true;
      input.dispatchEvent(new Event('change'));

      expect(eventFired).to.be.true;
      expect(eventChecked).to.be.true;
      expect(element.checked).to.be.true;
    });

    it('should clear indeterminate state on change', async () => {
      element.indeterminate = true;
      await element.updateComplete;

      const input = element.shadowRoot.querySelector('input');
      input.checked = true;
      input.dispatchEvent(new Event('change'));

      expect(element.indeterminate).to.be.false;
    });

    it('should dispatch event with bubbles', async () => {
      await element.updateComplete;

      let event = null;
      element.addEventListener('change', (e) => {
        event = e;
      });

      const input = element.shadowRoot.querySelector('input');
      input.checked = true;
      input.dispatchEvent(new Event('change'));

      expect(event.bubbles).to.be.true;
    });
  });

  describe('click handling', () => {
    it('should toggle checked state when clicked', async () => {
      await element.updateComplete;

      const label = element.shadowRoot.querySelector('label');
      label.click();

      expect(element.checked).to.be.true;
    });

    it('should toggle back to unchecked when clicked again', async () => {
      element.checked = true;
      await element.updateComplete;

      const label = element.shadowRoot.querySelector('label');
      label.click();

      expect(element.checked).to.be.false;
    });
  });

  describe('styling', () => {
    it('should have proper CSS styles', () => {
      const styles = element.constructor.styles;
      expect(styles).to.exist;

      const cssText = styles.toString();
      expect(cssText).to.include('.checkbox-container');
      expect(cssText).to.include('.checkbox');
      expect(cssText).to.include('.checkmark');
      expect(cssText).to.include('.indeterminate-mark');
    });

    it('should have hover styles', () => {
      const styles = element.constructor.styles;
      const cssText = styles.toString();

      expect(cssText).to.include(':hover');
    });

    it('should have checked and indeterminate styles', () => {
      const styles = element.constructor.styles;
      const cssText = styles.toString();

      expect(cssText).to.include('.checked');
      expect(cssText).to.include('.indeterminate');
    });

    it('should hide native checkbox', () => {
      const styles = element.constructor.styles;
      const cssText = styles.toString();

      expect(cssText).to.include('opacity: 0');
      expect(cssText).to.include('position: absolute');
    });
  });

  describe('visual states', () => {
    it('should show correct visual for checked state', async () => {
      element.checked = true;
      element.indeterminate = false;
      await element.updateComplete;

      const checkbox = element.shadowRoot.querySelector('.checkbox');
      const checkmark = element.shadowRoot.querySelector('.checkmark');
      const indeterminateMark = element.shadowRoot.querySelector('.indeterminate-mark');

      expect(checkbox.classList.contains('checked')).to.be.true;
      expect(checkmark.style.display).to.not.equal('none');
      expect(indeterminateMark.style.display).to.equal('none');
    });

    it('should show correct visual for indeterminate state', async () => {
      element.checked = false;
      element.indeterminate = true;
      await element.updateComplete;

      const checkbox = element.shadowRoot.querySelector('.checkbox');
      const checkmark = element.shadowRoot.querySelector('.checkmark');
      const indeterminateMark = element.shadowRoot.querySelector('.indeterminate-mark');

      expect(checkbox.classList.contains('indeterminate')).to.be.true;
      expect(checkmark.style.display).to.equal('none');
      expect(indeterminateMark.style.display).to.not.equal('none');
    });

    it('should show correct visual for unchecked state', async () => {
      element.checked = false;
      element.indeterminate = false;
      await element.updateComplete;

      const checkbox = element.shadowRoot.querySelector('.checkbox');
      const checkmark = element.shadowRoot.querySelector('.checkmark');
      const indeterminateMark = element.shadowRoot.querySelector('.indeterminate-mark');

      expect(checkbox.classList.contains('checked')).to.be.false;
      expect(checkbox.classList.contains('indeterminate')).to.be.false;
      expect(checkmark.style.display).to.equal('none');
      expect(indeterminateMark.style.display).to.equal('none');
    });
  });

  describe('static properties', () => {
    it('should have proper static properties defined', () => {
      const properties = element.constructor.properties;
      expect(properties).to.exist;
      expect(properties.checked).to.exist;
      expect(properties.indeterminate).to.exist;
    });
  });
});
