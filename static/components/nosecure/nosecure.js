/**
 * @file Nosecure component helper script.
 * @author Jordan Mann
 */

/**
 *
 */
class NoSecure extends HTMLElement {
  /**
   * @param {DocumentFragment | undefined} templateContent the template content to use for this component.
   */
  constructor(templateContent) {
    if (templateContent === undefined) {
      throw new Error('Missing template content for no-secure component');
    }
    super();
    if (window.isSecureContext) {
      this.hidden = true;
    }
    if (this.children.length === 0) {
      this.append(templateContent);
    }
  }
}

/**
 * @type {ComponentConstructor<NoSecure>}
 */
const NoSecureComponent = NoSecure;

export default NoSecureComponent;
