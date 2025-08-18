import Tab from './tab/tab.js';

export default class Tabs extends HTMLElement {
  /**
   * TODO: descriptions should be required on class properties
   * @type {Map<Tab, HTMLElement>}
   */
  tabLabels;

  wrapper;

  /**
   * @type {HTMLElement | null}
   */
  currentLabel = null;

  /**
   * @type {(els: Element[]) => asserts els is Tab[] }
   */
  static tryCoerceTabs(els) {
    for (const child of els) {
      if (!(child instanceof Tab)) {
        // initially when the page is loaded, the components are all upgraded before the main script runs.
        // however during routing, tabs are inserted dynamically and upgraded as they are parsed.
        // this means the tabs-component is upgraded before its children, so they must be manually upgraded here.
        customElements.upgrade(child);
        if (!(child instanceof Tab)) {
          throw new Error(
            `Tabs component can only contain tab components, found ${child.constructor.name}!${
              customElements.get('tabs-tab-component') !== undefined
                ? ''
                : ' This is because because you registered tabs before tabs/tab!'
            }`
          );
        }
      }
    }
  }

  /**
   * @param {DocumentFragment | undefined} templateContent the template content to use for these tabs.
   */
  constructor(templateContent) {
    super();
    if (templateContent === undefined) {
      throw new Error('Missing template content for tabs component, please register with HTML.');
    }

    const wrapper = templateContent.querySelector('.tabs-content');

    if (!(wrapper instanceof HTMLElement)) {
      throw new Error('Could not find wrapper element for tabs component');
    }

    this.wrapper = wrapper;

    const header = templateContent.querySelector('.tabs-header');

    if (!(header instanceof HTMLElement)) {
      throw new Error('Could not find header element for tabs component');
    }

    const tabs = Array.from(this.children);
    Tabs.tryCoerceTabs(tabs);

    this.wrapper.replaceChildren(...tabs);

    this.tabLabels = new Map();
    const tabIds = new Set();

    for (const tab of tabs) {
      if (tabIds.has(tab.id)) {
        throw new Error(`Duplicate tab id '${tab.id}' found in tabs component!`);
      }
      tabIds.add(tab.id);
      // TODO: semantic tagging - and arrow navigation with tabindex -1
      const label = document.createElement('a');
      label.href = `#${tab.id}`;
      label.classList.add('no-ia');
      label.textContent = tab.label;
      label.dataset.label = tab.label;
      // label.addEventListener('click', () => this.select(tab));
      this.tabLabels.set(tab, label);
    }

    header.replaceChildren(...this.tabLabels.values());

    this.replaceChildren(templateContent);

    // TODO: initially selected tab using attr - check exclusive?
    this.select(tabs[0]);

    window.addEventListener('hashchange', () => {
      const tab = this.querySelector(window.location.hash);
      if (!(tab instanceof Tab)) {
        return;
      }
      const label = this.tabLabels.get(tab);
      if (label === undefined) {
        throw new Error(`Could not find corresponding label for tab ${tab.id}`);
      }
      this.currentLabel?.setAttribute('aria-current', 'false');
      label.setAttribute('aria-current', 'location');
      this.currentLabel = label;
    });
  }

  /**
   * TODO
   * @param {Tab} tab
   */
  select(tab) {
    const tabLabel = this.tabLabels.get(tab);
    if (tabLabel === undefined) {
      throw new Error('Could not find label for tab to select!');
    }
    tabLabel.click();
  }
}
