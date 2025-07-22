/**
 * @file Switcher component helper script.
 * @author Jordan Mann
 * @todo Currently all options must be pre-defined. Should they be editable?
 * @todo getter to get the current value, even if this is trivial using the form.
 */

/**
 * Set up the switcher component, which involves copying inputs from the light DOM
 * into a form in the shadow DOM and wiring them up (e.g. with labels).
 *
 * checkme the above
 * @see {@link createComponent}
 * @this {SwitcherComponent}
 */
export default function setup() {
  if (this.shadowRoot === null) {
    throw new Error(
      'Expected shadow root to be set up with template content before setup function was called'
    );
  }
  const form = this.shadowRoot.querySelector('form');
  if (form === null) {
    throw new Error('Could not find form in which to set up switcher');
  }
  const inputs = this.querySelectorAll('input');
  form.append(...this.children);
  const name = this.dataset.name;
  if (name === undefined) {
    throw new Error('Missing expected attribute data-name');
  }
  const layout = this.dataset.layout !== undefined;
  if (this.dataset.cellWidth !== undefined) {
    form.style.setProperty('--cell-width', this.dataset.cellWidth);
  }
  form.style.setProperty('--cells', inputs.length.toString());
  const indicator = document.createElement('div');
  indicator.classList.add('indicator');
  form.append(indicator);
  inputs.forEach((input, i) => {
    // fixme what to do when this component is in the layout?
    (layout ? input.layoutAddEventListener : input.addEventListener).call(
      input,
      'change',
      () =>
        input.checked &&
        (indicator.style.setProperty('--selected', (i + 1).toString()),
        this.dispatchEvent(new CustomEvent('switch', { detail: { value: input.value } })))
    );
    if (input.checked) {
      indicator.style.setProperty('--selected', (i + 1).toString());
    }
    input.setAttribute('name', name);
    input.setAttribute('type', 'radio');
    const id = name + '-' + input.getAttribute('value');
    input.setAttribute('id', id);
    const label = document.createElement('label');
    label.setAttribute('for', id);
    const labelContent = input.dataset.label ?? input.getAttribute('value');
    if (labelContent === null) {
      throw new Error(
        'Missing expected attribute data-label or value with which to label this cell'
      );
    }
    label.innerText = labelContent;
    input.style.setProperty('--cell', (i + 1).toString());
    label.style.setProperty('--cell', (i + 1).toString());
    form.append(label);
  });
  this.values = [...inputs].map((x) => x.value);
  Object.defineProperty(this, 'value', {
    /**
     * Getter.
     * @returns {string | undefined} the value of the currently checked input;
     * that is, the switcher's value.
     */
    get: () => {
      /** @type {HTMLInputElement | null} */
      const checkedInput = form.querySelector('input:checked');
      return checkedInput?.value;
    },
    /**
     * Setter.
     * @param {string} value a radio value to find and select.
     */
    set: (value) => {
      /** @type {HTMLInputElement | null} */
      const input = form.querySelector(`input#${name}-${value}`);
      if (input === null) {
        throw new Error(`Could not find input matching given value "${value}"`);
      }
      ((input.checked = true), input.dispatchEvent(new Event('change')));
    }
  });
}
