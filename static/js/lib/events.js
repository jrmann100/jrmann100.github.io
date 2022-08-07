/**
 * @file Traps local event loop messages, to be removed when routing.
 * @author Jordan Mann
 */
/** todo timeouts */
/**
 * todo
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

EventTarget.prototype.addEventListener = function (
  /** @type {string} */ type,
  /** @type {EventListenerOrEventListenerObject | null} */ callback,
  /** @type {boolean | AddEventListenerOptions | undefined} */ options
) {
  localEventListeners.push({ node: this, type, callback });
  this.layoutAddEventListener(type, callback, options);
};

console.log('💂 events module ready.');
window.layoutSetInterval = window.setInterval;
window.setInterval = (
  /** @type {TimerHandler} */ handler,
  /** @type {number | undefined} */ timeout,
  /** @type {any[]} */ ...args
) => {
  const interval = window.layoutSetInterval(handler, timeout, ...args);
  localIntervals.push(interval);
  return interval;
};
