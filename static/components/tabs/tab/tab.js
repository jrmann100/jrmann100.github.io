/**
 * TODO
 * @type {ComponentConstructor}
 */
const Tab = class extends HTMLElement {
  constructor(templateContent) {
    super();
    this.replaceChildren(templateContent);
  }
};

export default Tab;
