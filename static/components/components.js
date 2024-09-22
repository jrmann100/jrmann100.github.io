/**
 * @file Component creator. Converts page fragments to Web Components.
 * @author Jordan Mann
 */

/* fixme - when we define light dom inside a component, as with <input>s in the <switcher-component>
 * so, what's going on here is that the light DOM is being rendered
 * before we suck all the contents into the shadow ~~realm~~ dom.
 * we could manually hide every item, but we would need to do that in the HTML, which is tedious.
 * we need to prevent that flicker at any cost
 */

/**
 * Register a custom element [name]-component.
 *
 * {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements Read the spec.}
 *
 * @see {@link customElements.define}
 * @param {string} name The component's name; components/[name]/* will be dynamically used as a template.
 * @param {CustomElementConstructor} extensionOf Element constructor to base this component off of. For autonomous custom elements <[name]-component>, this will just be HTMLElement.
 * @param {...any} args other arguments to pass to {@link customElements.define}
 */
function createComponent(name, extensionOf = HTMLElement, ...args) {
  customElements.define(
    name + '-component',
    /** Anonymous class with callbacks dynamically generated for this component. */
    class extends extensionOf {
      /**
       * Fetch content for this component and populate it.
       * checkme that none of this should happen in connectedCallback
       */
      constructor() {
        super();

        (async () => {
          /** We make a <template> with this content, which we will use to populate the shadow DOM. */
          const text = await fetch(`/static/components/${name}/${name}.html.inc`).then((res) =>
            res.text()
          );
          /** This script's default export - a setup function - gets called once the shadow DOM has been set up. */
          const setup = await import(`/static/components/${name}/${name}.js`).then(
            (module) => module.default,
            (err) => {
              if (err.message.startsWith('Failed to fetch dynamically imported module')) {
                return null;
              }
              throw err;
            }
          );
          const template = document.createElement('template'); // checkme maybe we should be storing these for re-use later? performance
          template.innerHTML = text;
          this.attachShadow({ mode: 'open' }).append(template.content);
          if (typeof setup !== 'function') {
            throw new Error(
              `Expected default export of "${name}.js" to be a setup function, not "${typeof setup}"`
            );
          }
          setup.call(this);
        })();
      }
    },
    ...args
  );
}

createComponent('switcher');
console.log('🧩 components module ready.');
