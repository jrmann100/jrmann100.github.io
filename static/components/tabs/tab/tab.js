/**
 * TODO
 */
export default class Tab extends HTMLElement {
  /**
   * @type {string}
   */
  label; // todo: upgrade to an html element?

  /**
   * @param {DocumentFragment} templateContent
   */
  constructor(templateContent) {
    super();
    if (this.dataset.label === undefined) {
      throw new Error('tab component must have data-label!');
    }
    this.label = this.dataset.label;
    this.replaceChildren(templateContent);
  }
}
