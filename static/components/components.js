/**
 * @file Component creator. Converts page fragments to Web Components.
 * @author Jordan Mann
 */

/**
 * Fetch the text content of a file at the given URL, throwing an error if the fetch is not ok.
 * @param {string} url URL to fetch the text content from.
 * @returns {Promise<string>} the text content of the file at the given URL.
 * @throws {Error} if the fetch fails or the response is not ok.
 */
const getTextOrThrow = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(
        `Failed to fetch: ${res.status} ${res.statusText}. Are you sure you meant to include it? `
      );
    }
    return res.text();
  });

/**
 * @typedef ComponentAutoOptions used when creating a component without a JS class.
 * @property {new () => HTMLElement} [extensionOf] The class to extend for this component.
 * @property {boolean} [shadow] Whether to use a shadow DOM for this component.
 */

/**
 * @typedef ComponentOptions describes how a component's definition files should be loaded.
 * @property {boolean} [html] whether to load a HTML include for this component.
 * @property {'global' | 'local' | false} [css] whether to load a stylesheet for this component.
 * @property {boolean | ComponentAutoOptions} [js] whether to load a JavaScript file for this component,
 * or how to handle the template if no JavaScript file is provided.
 */

/**
 * Cheap type assertion for a CustomElementConstructor.
 * @param {unknown} c The value to check.
 * @returns {c is CustomElementConstructor} whether C is probably a CustomElementConstructor.
 */
const isCustomElementConstructor = (c) =>
  typeof c === 'function' && c.prototype instanceof HTMLElement;

/**
 * Register a custom element [name]-component.
 *
 * {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements Read the spec.}
 * @see {@link customElements.define}
 * @param {string} name The component's name; used to reference components/[name]/[basename].*,
 * where [basename] is like 'tab' if name is 'tabs/tab' and registered as tabs-tab-component.
 * @param {ComponentOptions} [componentOptions] Describes how the component's definition files should be loaded.
 * By default, the component only loads HTML into the light DOM of a subclass of HTMLElement.
 * @param {ElementDefinitionOptions} [options] other arguments to pass to {@link customElements.define}
 */
export default async function createComponent(
  name,
  { html = true, css = false, js = false } = {},
  options
) {
  if (customElements.get(name + '-component') !== undefined) {
    return;
  }
  /**
   * The content of the HTML include for this component, if any.
   * @type {DocumentFragment|undefined}
   */
  let templateContent;

  /**
   * If a CustomElementConstructor is included in the JS file,
   * this will be a subclass that feeds in the HTML include content.
   * @type {(new () => HTMLElement) | undefined}
   */
  let CustomComponent;

  const basename = name.split('/').at(-1);

  if (html) {
    const template = document.createElement('template');
    template.innerHTML = await getTextOrThrow(`/static/components/${name}/${basename}.html.inc`);
    templateContent = template.content;
  }
  if (css === 'local') {
    // if the component is using a shadow DOM, we need to inject the styles directly into the shadow root
    const style = document.createElement('style');
    style.textContent = await getTextOrThrow(`/static/components/${name}/${basename}.css`);
    if (templateContent === undefined) {
      templateContent = document.createDocumentFragment();
    }
    templateContent.insertBefore(style, templateContent.firstChild);
  } else if (css === 'global') {
    const link = document.createElement('link');
    const linkLoaded = new Promise((resolve, reject) => {
      link.onload = resolve;
      link.onerror = reject;
    });
    link.rel = 'stylesheet';
    link.href = `/static/components/${name}/${basename}.css`;
    document.head.append(link);
    // checkme: timeout loading?
    await linkLoaded;
  }
  if (js === true) {
    const MaybeCustomElementConstructor = await import(
      `/static/components/${name}/${basename}.js`
    ).then(
      (module) => module.default,
      (err) => {
        if (err.message.startsWith('Failed to fetch dynamically imported module')) {
          return null;
        }
        throw err;
      }
    );

    if (!isCustomElementConstructor(MaybeCustomElementConstructor)) {
      throw new TypeError('Expected a CustomElementConstructor');
    }

    /**
     * Extend the given constructor, instantiating it with the template content.
     */
    CustomComponent = class extends MaybeCustomElementConstructor {
      constructor() {
        super(templateContent?.cloneNode(true));
      }
    };
  } else {
    // we may be given a class to extend, or fall back to HTMLElement
    const SuperClass = typeof js === 'object' && js?.extensionOf ? js.extensionOf : HTMLElement;
    const shadow = typeof js === 'object' && js?.shadow;
    /**
     * Extend the given class or HTMLElement, and append the template content.
     */
    CustomComponent = class extends SuperClass {
      constructor() {
        super();
        if (templateContent === undefined) {
          return;
        }
        if (shadow) {
          this.attachShadow({ mode: 'open' }).append(templateContent.cloneNode(true));
        } else {
          // TODO: consider hacking some equivalent to slots
          this.insertBefore(templateContent.cloneNode(true), this.firstChild);
        }
      }
    };
  }

  customElements.define(name.replaceAll('/', '-') + '-component', CustomComponent, options);
}
