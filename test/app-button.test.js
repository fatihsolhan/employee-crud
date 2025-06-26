import { expect, fixture, html } from '@open-wc/testing';
import '../src/components/ui/app-button.js';

describe('AppButton', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<app-button>Test Button</app-button>`);
  });

  it('should render the component', () => {
    expect(element).to.exist;
  });

  it('should display button with slot content', async () => {
    await element.updateComplete;
    const button = element.shadowRoot.querySelector('button');
    expect(button).to.exist;

    const slot = button.querySelector('slot');
    expect(slot).to.exist;
  });

  it('should have default variant', () => {
    expect(element.variant).to.equal('default');
  });

  it('should have default disabled state', () => {
    expect(element.disabled).to.be.false;
  });

  it('should have default type', () => {
    expect(element.type).to.equal('button');
  });

  describe('variants', () => {
    it('should apply default variant class', async () => {
      element.variant = 'default';
      await element.updateComplete;

      const button = element.shadowRoot.querySelector('button');
      expect(button.classList.contains('default')).to.be.true;
    });

    it('should apply outline variant class', async () => {
      element.variant = 'outline';
      await element.updateComplete;

      const button = element.shadowRoot.querySelector('button');
      expect(button.classList.contains('outline')).to.be.true;
    });

    it('should apply ghost variant class', async () => {
      element.variant = 'ghost';
      await element.updateComplete;

      const button = element.shadowRoot.querySelector('button');
      expect(button.classList.contains('ghost')).to.be.true;
    });

    it('should apply circle variant class', async () => {
      element.variant = 'circle';
      await element.updateComplete;

      const button = element.shadowRoot.querySelector('button');
      expect(button.classList.contains('circle')).to.be.true;
    });

    it('should apply circle-active variant class', async () => {
      element.variant = 'circle-active';
      await element.updateComplete;

      const button = element.shadowRoot.querySelector('button');
      expect(button.classList.contains('circle-active')).to.be.true;
    });
  });

  describe('disabled state', () => {
    it('should apply disabled attribute when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      const button = element.shadowRoot.querySelector('button');
      expect(button.disabled).to.be.true;
    });

    it('should not apply disabled attribute when not disabled', async () => {
      element.disabled = false;
      await element.updateComplete;

      const button = element.shadowRoot.querySelector('button');
      expect(button.disabled).to.be.false;
    });
  });

  describe('button type', () => {
    it('should set button type to button by default', async () => {
      await element.updateComplete;

      const button = element.shadowRoot.querySelector('button');
      expect(button.type).to.equal('button');
    });

    it('should set button type to submit when specified', async () => {
      element.type = 'submit';
      await element.updateComplete;

      const button = element.shadowRoot.querySelector('button');
      expect(button.type).to.equal('submit');
    });

    it('should set button type to reset when specified', async () => {
      element.type = 'reset';
      await element.updateComplete;

      const button = element.shadowRoot.querySelector('button');
      expect(button.type).to.equal('reset');
    });
  });

  describe('click events', () => {
    it('should handle click events', async () => {
      let clicked = false;
      element.addEventListener('click', () => {
        clicked = true;
      });

      await element.updateComplete;
      const button = element.shadowRoot.querySelector('button');
      button.click();

      expect(clicked).to.be.true;
    });

    it('should not fire click events when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      let clicked = false;
      element.addEventListener('click', () => {
        clicked = true;
      });

      const button = element.shadowRoot.querySelector('button');
      button.click();

      expect(clicked).to.be.false;
    });
  });

  describe('styling', () => {
    it('should have CSS styles defined', () => {
      const styles = element.constructor.styles;
      expect(styles).to.exist;
    });

    it('should include variant-specific styles', () => {
      const styles = element.constructor.styles;
      const cssText = styles.toString();

      expect(cssText).to.include('.default');
      expect(cssText).to.include('.outline');
      expect(cssText).to.include('.ghost');
      expect(cssText).to.include('.circle');
      expect(cssText).to.include('.circle-active');
    });

    it('should include hover styles', () => {
      const styles = element.constructor.styles;
      const cssText = styles.toString();

      expect(cssText).to.include(':hover');
    });

    it('should include disabled styles', () => {
      const styles = element.constructor.styles;
      const cssText = styles.toString();

      expect(cssText).to.include(':disabled');
    });
  });

  describe('with icon content', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <app-button variant="circle">
          <svg width="16" height="16"><rect width="16" height="16"/></svg>
        </app-button>
      `);
    });

    it('should display icon content', async () => {
      await element.updateComplete;
      const button = element.shadowRoot.querySelector('button');
      const slot = button.querySelector('slot');
      expect(slot).to.exist;
    });
  });

  describe('with text and icon content', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <app-button>
          <svg width="16" height="16"><rect width="16" height="16"/></svg>
          Button Text
        </app-button>
      `);
    });

    it('should display both icon and text content', async () => {
      await element.updateComplete;
      const button = element.shadowRoot.querySelector('button');
      const slot = button.querySelector('slot');
      expect(slot).to.exist;
    });
  });

  describe('static properties', () => {
    it('should have proper static properties defined', () => {
      const properties = element.constructor.properties;
      expect(properties).to.exist;
      expect(properties.variant).to.exist;
      expect(properties.disabled).to.exist;
      expect(properties.type).to.exist;
    });
  });
});
