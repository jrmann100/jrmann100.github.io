import Tab from './tab/tab.js';

export default class Tabs extends HTMLElement {
  /**
   * @type {Tab[]}
   */
  tabs;

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

    const header = templateContent.querySelector('.tabs-header');

    if (!(header instanceof HTMLElement)) {
      throw new Error('Could not find header element for tabs component');
    }

    const tabs = Array.from(this.children);
    Tabs.tryCoerceTabs(tabs);
    this.tabs = tabs;

    header.replaceChildren(
      ...tabs.map((tab) => {
        // TODO: semantic tagging
        const label = document.createElement('div');
        label.textContent = tab.label;
        return header.appendChild(label);
      })
    );

    wrapper.replaceChildren(...this.children);

    this.replaceChildren(templateContent);
  }
}
