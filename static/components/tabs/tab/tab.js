/**
 * TODO
 */
export default class Tab extends HTMLElement {
  /**
   * @type {string}
   */
  label; // todo: upgrade to an html element?

  constructor() {
    super();
    if (this.id === '') {
      throw new Error('Tab component must have a non-empty id!');
    }
    this.label = this.dataset.label ?? this.id;
  }
}
