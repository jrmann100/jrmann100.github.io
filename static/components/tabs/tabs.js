import Tab from './tab/tab';

/**
 * TODO
 * @type {ComponentConstructor}
 */
const Tabs = class extends HTMLElement {
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
    for (const child of this.childNodes) {
      if (!(child instanceof Tab)) {
        throw new Error(
          'Tabs component can only contain tab components, found' + child.constructor.name
        );
      }
    }

    wrapper.append(...this.childNodes);
    this.replaceChildren(templateContent);
  }
};

export default Tabs;
