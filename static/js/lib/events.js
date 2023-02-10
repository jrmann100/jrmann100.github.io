/**
 * @file Traps local event loop messages, to be removed when routing.
 * @author Jordan Mann
 */
/** todo timeouts */

/**
 * Event listeners which are local to a page fragment, and should be cleared when we change routes.
 *
 * @type {{node: EventTarget; type: string; callback: EventListenerOrEventListenerObject | null}[]}
 */
var localEventListeners = [];

/** @type {number[]} */
var localIntervals = [];

// checkme should be navigate or beforenavigate?
document.addEventListener('beforenavigate', () => {
  const removedListeners = localEventListeners.length;
  localEventListeners.forEach(({ node, type, callback }) =>
    node.removeEventListener(type, callback)
  );
  localEventListeners = [];

  const removedIntervals = localIntervals.length;
  localIntervals.forEach(clearInterval);
  localIntervals = [];

  let items = [];
  if (removedListeners > 0) {
    items.push(removedListeners + ' event listener(s)');
  }
  if (removedIntervals > 0) {
    items.push(removedIntervals + ' interval(s)');
  }
  if (items.length > 0) {
    console.log(`💂 removed ${items.join(', ')}`);
  }
});

EventTarget.prototype.layoutAddEventListener = EventTarget.prototype.addEventListener;

/**
 * We override addEventListener for page-local scripts.
 *
 * @param {string} type event type to receive.
 * @param {EventListenerOrEventListenerObject | null} callback event handler.
 * @param {boolean | AddEventListenerOptions | undefined} options additional listener configuration.
 */
EventTarget.prototype.addEventListener = function (type, callback, options) {
  localEventListeners.push({ node: this, type, callback });
  this.layoutAddEventListener(type, callback, options);
};

console.log('💂 events module ready.');
window.layoutSetInterval = window.setInterval;

/**
 * We override setInerval for page-local scripts.
 *
 * @param {TimerHandler} handler called on every pulse.
 * @param {number | undefined} timeout milliseconds between pulses.
 * @param {any[]} args other args used by window.setInterval().
 * @returns {number} an interval ID.
 */
window.setInterval = (handler, timeout, ...args) => {
  const interval = window.layoutSetInterval(handler, timeout, ...args);
  localIntervals.push(interval);
  return interval;
};
