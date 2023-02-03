/**
 *
 * @param name
 * @param extensionOf
 * @param {...any} args
 */

/* fixme
 * so, what's going on here is that the light DOM is being rendered
 * before we suck all the contents into the shadow ~~realm~~ dom.
 * we could manually hide every item, but we would need to do that in the HTML, which is tedious.
 * we need to prevent that flicker at any cost
 */
/**
 *
 * @param name
 * @param extensionOf
 * @param {...any} args
 */
function createComponent(name, extensionOf, ...args) {
  customElements.define(
    name + '-component',
    class extends extensionOf {
      static text = fetch(`/static/components/${name}/${name}.html.inc`).then((res) => res.text());
      static setup = import(`/static/components/${name}/${name}.js`).then(
        (module) => module.default,
        (err) => {
          if (err.message.startsWith('Failed to fetch dynamically imported module')) {
            return null;
          }
          throw err;
        }
      );
      constructor() {
        super();
      }
      connectedCallback() {
        if (!this.isConnected) {
          return;
        }
        Promise.all([this.constructor.text, this.constructor.setup]).then(([text, setup]) => {
          const template = document.createElement('template'); // checkme maybe we should be storing these for re-use later? performance
          template.innerHTML = text;
          this.attachShadow({ mode: 'open' }).append(template.content);
          setup.call(this);
        });
      }
    },
    ...args
  );
}

createComponent('switcher', HTMLElement);
console.log('🧩 components module ready.');
