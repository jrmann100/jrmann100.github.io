/**
 * TODO
 */
export default class Tab extends HTMLElement {
  constructor(templateContent) {
    super();
    this.replaceChildren(templateContent);
  }
}
