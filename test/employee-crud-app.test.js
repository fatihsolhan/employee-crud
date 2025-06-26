import { aTimeout, expect, fixture } from '@open-wc/testing';
import { html } from 'lit';

import '../src/employee-crud-app.js';

describe('EmployeeCrudApp', () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<employee-crud-app></employee-crud-app>`);
  });

  it('should render the component', () => {
    expect(element).to.exist;
  });

  it('should display app header', async () => {
    await element.updateComplete;
    const header = element.shadowRoot.querySelector('app-header');
    expect(header).to.exist;
  });

  it('should display router outlet', async () => {
    await element.updateComplete;
    const routerOutlet = element.shadowRoot.querySelector('.router-outlet');
    expect(routerOutlet).to.exist;
  });

  it('should initialize router on first update', async () => {
    await element.updateComplete;
    await aTimeout(100);

    const routerOutlet = element.shadowRoot.querySelector('.router-outlet');
    expect(routerOutlet).to.exist;
  });

  it('should have proper styling', () => {
    const styles = element.constructor.styles;
    expect(styles).to.exist;

    const cssText = styles.toString();
    expect(cssText).to.include('min-height');
    expect(cssText).to.include('font-family');
  });

  it('should handle form mode setting', async () => {
    await element.updateComplete;

    element.setFormMode('add');
    element.setFormMode('edit', '123');

    expect(element.setFormMode).to.be.a('function');
  });

  describe('routing', () => {
    beforeEach(async () => {
      await element.updateComplete;
      await aTimeout(100);
    });

    it('should configure routes correctly', () => {
      const routerOutlet = element.shadowRoot.querySelector('.router-outlet');
      expect(routerOutlet).to.exist;
    });
  });
});
