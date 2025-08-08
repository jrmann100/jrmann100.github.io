/**
 * @file Rippling card module. Implements a very beautiful and very unnecessarily complicated custom element.
 * @author Jordan Mann
 */

// Need to test on Windows, in which everything is broken.
// Safari does _not_ support pesudo animations (?)

// We're waiting for the mouse to be released on this button;
// when that happens, we'll unbind the boundButton function.
// Better, non-static fixes greatly appreciated.

// Thanks to MDN Web Docs for the help.

/**
 * A fancy card-sized button with a ripple effect on user click.
 * @property {null | (MouseEvent) => void } boundButton function to handle document mouseup, bound to a single pressed component.
 */
export class RipplingCard extends HTMLElement {
  /**
   * If either of these attrs are changed,
   * we will need to re-render the button.
   * @returns {string[]} a list of attribute names.
   */
  static get observedAttributes() {
    return ['d', 'text'];
  }

  /**
   * Instantiate, append, and wire up content.
   * @param {DocumentFragment | undefined} content the content to append to the shadow root.
   */
  constructor(content) {
    super();
    if (content === undefined) {
      throw new Error('Missing template content for ripple component');
    }
    /** Shadow root, into which we can insert content. */
    const shadow = this.attachShadow({
      mode: 'open'
    });
    shadow.append(content);
    this.boundButton = null;

    const wrapper = shadow.querySelector('.wrapper');
    if (!(wrapper instanceof HTMLDivElement)) {
      throw new Error('Could not find wrapper');
    }
    const svg = shadow.querySelector('svg');
    if (!(svg instanceof SVGElement)) {
      throw new Error('Could not find SVG element');
    }
    const path = svg.querySelector('path');
    if (!(path instanceof SVGPathElement)) {
      throw new Error('Could not find SVG path element');
    }
    const span = shadow.querySelector('span');
    if (!(span instanceof HTMLSpanElement)) {
      throw new Error('Could not find span element');
    }

    wrapper.classList.add('wrapper');
    // You can actually tab through the buttons for keyboard control.
    // Haven't figured out tab cycling, but I'd like to.
    this.setAttribute('tabindex', '0');
    this.addEventListener('mousedown', this.rippleClick.bind(this));

    this.addEventListener('keydown', (ev) => {
      // Simulate a mousedown in the center
      // on an enter/spacebar keypress for a focused button.
      if (ev.keyCode == 13 || ev.keyCode == 32) {
        var box = wrapper.getBoundingClientRect();
        this.dispatchEvent(
          new MouseEvent('mousedown', {
            clientX: box.x + box.width / 2,
            clientY: box.y + box.height / 2
          })
        );
      }
    });
    // Another unfortunate product of complicated events:
    // this deactivation event listener can be removed
    // if another mousedown occurs.
    this.deactivateCheckerTimeout = null;
  }

  /**
   * Getter.
   * @returns {SVGPathElement} path of this card's icon.
   */
  get path() {
    const path = this.shadowRoot?.querySelector('path');
    if (!(path instanceof SVGPathElement)) {
      throw new Error("could not find rippling card's path");
    }
    return path;
  }

  /**
   * Getter.
   * @returns {HTMLSpanElement} this card's span.
   */
  get span() {
    const span = this.shadowRoot?.querySelector('span');
    // checkme
    if (!(span instanceof HTMLSpanElement)) {
      throw new Error("could not find rippling card's span");
    }
    return span;
  }

  /**
   * Get the button's shadow wrapper element.
   * @returns {HTMLDivElement} the shadow wrapper element.
   */
  get wrapper() {
    const wrapper = this.shadowRoot?.querySelector('div.wrapper');
    if (!(wrapper instanceof HTMLDivElement)) {
      throw new Error("could not find rippling card's wrapper");
    }
    return wrapper;
  }

  /**
   * Set appropriate CSS properties for the element's
   * attributes. The "d" corresponds to the SVG path;
   * the title-text to the span.
   */
  updateStyle() {
    // checkme https://github.com/microsoft/TypeScript/issues/22238
    const d = this.getAttribute('d');
    if (d !== null) {
      this.path.setAttribute('d', d);
    }
    const text = this.getAttribute('text');
    if (text !== null) {
      this.span.textContent = text;
    }
  }

  /** Button added to page. Check for attributes. */
  connectedCallback() {
    this.updateStyle();
  }

  /**
   * Fires when an observed attribute is updated.
   */
  attributeChangedCallback() {
    this.updateStyle();
  }

  /**
   * Handle a mouse event; start a ripple UI effect.
   * @param {MouseEvent} ev the mouse event.
   */
  rippleClick(ev) {
    // This needs to be a left-click.
    if (ev.button == 0) {
      var box = this.wrapper.getBoundingClientRect();
      // If the click occurs while an animation is already
      // going on, we need to reset everything.
      if (this.deactivateCheckerTimeout !== null) {
        clearTimeout(this.deactivateCheckerTimeout);
      }
      if (this.boundButton !== null) {
        this.removeEventListener('mouseup', this.boundButton);
      }
      this.wrapper.classList.remove('deactivate');
      this.wrapper.classList.remove('activate');
      // These CSS variables dictate the ripple's origin.
      this.wrapper.style.setProperty('--ripple-top', ev.clientY - box.y + 'px');
      this.wrapper.style.setProperty('--ripple-left', ev.clientX - box.x + 'px');
      // We actually need a pause for the browser renderer
      // to realize that the "activate" class was reloaded.
      setTimeout(() => {
        this.wrapper.classList.add('activate');
      }, 10);
      // Perform a slight 3D transformation that gives
      // the appearance of the button being depressed on its corner.
      // I've disabled this because it was causing an icky visual glitch.
      this.wrapper.style.transform = `perspective(12rem) rotateY(${
        ((box.width / 2 - (ev.clientX - box.x)) / box.width) * -5
      }deg) rotateX(${
        ((box.height / 2 - (ev.clientY - box.y)) / box.height) * 5
      }deg) translateY(0rem) translateZ(0rem)`;
      // Check for deactivation after the animation completes.
      this.deactivateCheckerTimeout = setTimeout(this.deactivateChecker.bind(this), 200);
    }
  }

  /**
   * The deactivation checker called in the checker event listener.
   * If the button has already been released, we can deactivate it;
   * Otherwise, we need to add an event listener.
   */
  deactivateChecker() {
    if (!this.matches(':active')) {
      this.deactivate(this.wrapper);
    } else {
      this.boundButton = this.deactivateEvent.bind(this);
      document.addEventListener('mouseup', this.boundButton);
    }
  }

  /**
   * Deactivate the button,
   * then remove the "deactivate" class we added.
   * @param {HTMLDivElement} wrapper the shadow wrapper element.
   */
  deactivate(wrapper) {
    wrapper.style.transform = 'inherit';
    wrapper.classList.add('deactivate');
    wrapper.classList.remove('activate');
    setTimeout(() => {
      wrapper.classList.remove('deactivate');
    }, 200);
    if (this.boundButton !== null) {
      document.removeEventListener('mouseup', this.boundButton);
    }
  }

  /**
   * An event listener callback to deactivate on mouseup.
   */
  deactivateEvent() {
    this.deactivate(this.wrapper);
  }
}

/**
 *  A fancy card-sized button with a ripple effect on user click.
 * @type {CustomElementConstructor}
 */
const RippleComponent = RipplingCard;

export default RippleComponent;
