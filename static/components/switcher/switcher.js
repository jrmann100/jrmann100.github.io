/**
 *
 * @param content
 * @this {HTMLElement}
 */
export default function setup() {
  const form = this.shadowRoot.querySelector('form');
  const inputs = this.querySelectorAll('input');
  form.append(...this.children);
  const name = this.dataset.name;
  const layout = this.dataset.layout !== undefined;
  if (this.dataset.cellWidth !== undefined) {
    form?.style.setProperty('--cell-width', this.dataset.cellWidth);
  }
  form?.style.setProperty('--cells', inputs.length.toString());
  const indicator = document.createElement('div');
  indicator.classList.add('indicator');
  form?.append(indicator);
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
    label.innerText = input.dataset.label ?? input.getAttribute('value');
    input.style.setProperty('--cell', (i + 1).toString());
    label.style.setProperty('--cell', (i + 1).toString());
    form?.append(label);
  });
  this.values = [...inputs].map((x) => x.value);
  this.switch = (value) => {
    const input = form.querySelector(`input#${name}-${value}`);
    (input.checked = true), input?.dispatchEvent(new Event('change'));
  };
  this.clear = {};
  this._make = 1;
}
