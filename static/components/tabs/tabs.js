import Tab from './tab/tab.js';

export default class Tabs extends HTMLElement {
  /**
   * @param {DocumentFragment | undefined} templateContent the template content to use for these tabs.
   */
  constructor(templateContent) {
    super();
    if (templateContent === undefined) {
      throw new Error('Missing template content for tabs component, please register with HTML.');
    }
    const wrapper = templateContent.querySelector('.tabs-component');
    if (!(wrapper instanceof HTMLElement)) {
      throw new Error('Could not find wrapper element for tabs component');
    }
    if (customElements.get('tabs-tab-component') === undefined) {
      throw new Error('register tabs/tab before registering tabs!');
    }
    for (const child of this.children) {
      console.log(child, Object.getPrototypeOf(child));
      if (!(child instanceof Tab)) {
        throw new Error(
          `Tabs component can only contain tab components, found ${child.constructor.name}`
        );
      }
    }

    wrapper.replaceChildren(...this.children);

    this.replaceChildren(templateContent);
  }
}
