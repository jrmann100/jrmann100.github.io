import Tab from './tab/tab.js';

// TODO: document that we are incorrectly using "tab" to define a tab panel,
// and "label" to define a tab.

export default class Tabs extends HTMLElement {
  /**
   * TODO: descriptions should be required on class properties
   * @type {Map<Tab, HTMLElement>}
   */
  tabLabels;

  /**
   * @type {Tab[]}
   */
  tabs;

  wrapper;

  /**
   * @type {Tab | null}
   */
  currentTab = null;

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

  handleChange() {
    if (window.location.hash.length < 2) {
      return;
    }
    const tab = this.querySelector(window.location.hash);
    if (!(tab instanceof Tab)) {
      return;
    }
    if (this.currentTab !== null) {
      const prevLabel = this.tabLabels.get(this.currentTab);
      if (prevLabel === undefined) {
        throw new Error(`Could not find corresponding label for tab ${this.currentTab.id}`);
      }
      prevLabel.setAttribute('aria-current', 'false');
      prevLabel.tabIndex = -1;
      this.currentTab.classList.toggle('target', false);
    }
    const label = this.tabLabels.get(tab);
    if (label === undefined) {
      throw new Error(`Could not find corresponding label for tab ${tab.id}`);
    }
    label.setAttribute('aria-current', 'location');
    label.removeAttribute('tabindex');
    this.currentTab = tab;
    tab.classList.toggle('target', true);
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

    this.tabs = tabs;

    this.wrapper.replaceChildren(...tabs);

    this.tabLabels = new Map();
    const tabIds = new Set();

    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      if (tabIds.has(tab.id)) {
        throw new Error(`Duplicate tab id '${tab.id}' found in tabs component!`);
      }
      tabIds.add(tab.id);
      // TODO: semantic tagging - and arrow navigation with tabindex -1
      const label = document.createElement('button');
      label.classList.add('lbl');
      // labels operate exactly like anchor links but they aren't really styled as such,
      // and WAI example uses buttons.
      label.addEventListener('click', () => this.select(tab));
      label.classList.add('no-ia');
      const span = document.createElement('span');
      span.textContent = tab.label;
      label.appendChild(span);
      label.dataset.label = tab.label;
      label.tabIndex = -1;
      // label.addEventListener('click', () => this.select(tab));
      this.tabLabels.set(tab, label);
      label.addEventListener('keydown', (ev) => {
        let j;
        // todo: switch to up/down when tabs wrap?
        if (ev.key === 'ArrowLeft') {
          j = i - 1;
        }
        if (ev.key === 'ArrowRight') {
          j = (i + 1) % tabs.length;
        }
        if (ev.key === 'Home') {
          j = 0;
        }
        if (ev.key === 'End') {
          j = -1;
        }
        const nextTab = tabs.at(j);
        if (nextTab === undefined) {
          throw new Error(`Selected tab index ${j} is out of bounds!`);
        }
        this.select(nextTab);
      });
    }

    header.replaceChildren(...this.tabLabels.values());

    this.replaceChildren(templateContent);

    // TODO: default selected tab using attr (lower precedence than hash) - check exclusive?
    if (window.location.hash.length < 2) {
      if (tabs.length > 0) {
        window.history.replaceState(null, '', `#${tabs[0].id}`);
        console.log(window.location.hash, document.querySelector(window.location.hash));
      }
    }
    this.handleChange();

    window.addEventListener('hashchange', () => this.handleChange());
  }

  /**
   * TODO
   * @param {Tab} tab
   */
  select(tab) {
    window.history.replaceState(5, '', `#${tab.id}`);
    this.handleChange(); // replaceState does not trigger hashchange.
    this.tabLabels.get(tab)?.focus();
  }
}
