/**
 * TODO
 */
export default class Tab extends HTMLElement {
  /**
   * A human-readable label which represents this tab.
   * @type {string}
   */
  label; // todo: upgrade to an html element?

  /**
   * A unique identifier for this tab.
   * @type {string}
   */
  tabId;

  constructor() {
    super();
    if (this.dataset.id === undefined || this.dataset.id === '') {
      throw new Error('Tab component must have a non-empty data-name!');
    }
    this.tabId = this.dataset.id;
    this.label = this.dataset.label ?? this.tabId;
  }
}
