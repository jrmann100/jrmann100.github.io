import Tab from './tab/tab.js';

// TODO: WARNING: this uses the global hash to id tabs;
// this means individual tab panels cannot share IDs across tabs components.
// We might resolve this by moving state into query params and namespacing by a (auto-generated?) tabs component ID.
// Hash is also not ideal since it treats tabs as anchors.

/**
 * A tab panel component which automatically generates a tab list for its children,
 * which themselves are custom "tab" components.
 *
 * The component is designed to conform with the ARIA APG tabs design pattern:
 * {@link https://www.w3.org/WAI/ARIA/apg/patterns/tabs/}
 *
 * However, for simplicity, we call each tab panel a "tab" and the tabs themselves "labels".
 */
export default class Tabs extends HTMLElement {
  /**
   * The child tab labels, as mapped from their corresponding tab panels.
   * @type {Map<Tab, HTMLElement>}
   */
  tabLabels;

  /**
   * The child tab panels.
   * @type {Tab[]}
   */
  tabs;

  /**
   * The component which wraps the tab panels and labels.
   */
  wrapper;

  /**
   * The currently displayed tab panel, if any.
   * @type {Tab | null}
   */
  currentTab = null;

  /**
   * Assert that all elements are Tab components,
   * registering the Tab component if necessary.
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
   * Handles a change to the page's URL hash, which is matched against tab panel IDs
   * to determine which tab panel to display.
   * If the hash does not match any tab panel ID, no action is taken.
   */
  handleChange() {
    // checkme: maybe empty hash should revert to default tab once default tab is implemented?
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
        } else if (ev.key === 'ArrowRight') {
          j = (i + 1) % tabs.length;
        } else if (ev.key === 'Home') {
          j = 0;
        } else if (ev.key === 'End') {
          j = -1;
        } else {
          return;
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
      }
    }
    this.handleChange();

    window.addEventListener('hashchange', () => this.handleChange());
  }

  /**
   * Trigger selection of a tab panel by changing the page's URL hash.
   * @param {Tab} tab the tab panel to select.
   */
  select(tab) {
    window.history.replaceState(5, '', `#${tab.id}`);
    this.handleChange(); // replaceState does not trigger hashchange.
    this.tabLabels.get(tab)?.focus();
  }
}
