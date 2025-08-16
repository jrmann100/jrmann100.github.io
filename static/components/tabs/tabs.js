import Tab from './tab/tab.js';

export default class Tabs extends HTMLElement {
  /**
   * TODO: descriptions should be required on class properties
   * @type {Map<Tab, HTMLElement>}
   */
  tabLabels;

  /**
   * TODO
   * @type {Tab | null}
   */
  selectedTab = null;

  wrapper;

  hiddenWrapper;

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

    const hiddenWrapper = templateContent.querySelector('.tabs-hidden');
    if (!(hiddenWrapper instanceof HTMLElement)) {
      throw new Error('Could not find hidden wrapper element for tabs component');
    }
    this.hiddenWrapper = hiddenWrapper;

    const header = templateContent.querySelector('.tabs-header');

    if (!(header instanceof HTMLElement)) {
      throw new Error('Could not find header element for tabs component');
    }

    const tabs = Array.from(this.children);
    Tabs.tryCoerceTabs(tabs);

    this.hiddenWrapper.replaceChildren(...tabs);

    this.tabLabels = new Map(
      tabs.map((tab) => {
        // TODO: semantic tagging - and arrow navigation with tabindex -1
        const label = document.createElement('button');
        label.classList.add('no-ia');
        label.textContent = tab.label;
        label.dataset.label = tab.label;
        label.addEventListener('click', () => this.select(tab));
        return [tab, label];
      })
    );

    // TODO: initially selected tab
    this.select(tabs[0]);

    header.replaceChildren(...this.tabLabels.values());

    this.replaceChildren(templateContent);
  }

  /**
   * TODO
   * @param {Tab} tab
   */
  select(tab) {
    if (!this.tabLabels.has(tab)) {
      throw new Error('Can only select tabs that are children of this Tabs component!');
    }
    if (this.selectedTab === tab) {
      return;
    }
    if (this.selectedTab !== null) {
      this.tabLabels.get(this.selectedTab)?.setAttribute('aria-selected', 'false');
      this.hiddenWrapper.appendChild(this.selectedTab);
    }
    this.selectedTab = tab;
    this.tabLabels.get(tab)?.setAttribute('aria-selected', 'true');

    this.wrapper.replaceChildren(tab);
  }
}
