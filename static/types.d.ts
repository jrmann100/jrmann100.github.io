/**
 * @file Additional types used across modules.
 * @author Jordan Mann
 */

/**
 * Objects which can receive events.
 */
interface EventTarget {
  // fixme referencing a module/file with @see
  /**
   * We override addEventListener for page-local scripts,
   * but the template and certain scripts will need
   * persistent event listeners.
   * @see events.js
   * @param type event type to receive.
   * @param callback event handler.
   * @param options additional listener configuration.
   */
  layoutAddEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions | undefined
  ): void;
}

/**
 * Contains the DOM.
 */
interface Window {
  /**
   * We override setInterval for page-local scripts,
   * but the template and certain scripts will need
   * persistent event listeners.
   * @param handler called on every pulse.
   * @param timeout milliseconds between pulses.
   * @param arguments other args used by window.setInterval().
   * @returns an interval ID.
   */
  layoutSetInterval(handler: TimerHandler, timeout?: number, ...arguments: unknown[]): number;
}

/**
 * Combination of configuration values used by colors module.
 * @see colors.js
 */
interface ColorScheme {
  /**
   * The user's preference of how colors are selected.
   * Auto (default): select "light" or "dark" depending on the system.
   * Light, dark: pick light or dark colors randomly.
   * Lock: use the previous {@link ColorScheme.colors colors}.
   * null: this has not yet been set.
   */
  pref: 'light' | 'auto' | 'dark' | 'lock' | null;
  /**
   * The set, if any, from which colors should be randomly chosen.
   */
  set: 'light' | 'dark' | null;
  /**
   * The current or most recently used colors.
   */
  colors: string[];
}
/** todo */

/**
 * Creates a new component instance.
 * @param templateContent the template content to use for this component.
 */
type ComponentConstructor<T extends HTMLElement = HTMLElement> = new (
  templateContent?: DocumentFragment
) => T;

/**
 * Switcher; a very fancy radio list.
 * Dispatches a "switch" event on change:
 *
 * `new CustomEvent('switch', { detail: { value } }))`
 */
interface SwitcherComponent extends HTMLElement {
  /**
   * The available values to switch between.
   */
  values: string[];
  /**
   * Smart property. Switches to new value when assigned.
   */
  value: string;
}
