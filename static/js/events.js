/**
 * todo
 *
 * @type {{node: Window | Node; type: string; callback: EventListenerOrEventListenerObject}[]}
 */
var localEventListeners = [];

document.documentElement.addEventListener('navigate', () => {
  for (
    let entry = localEventListeners.pop();
    entry !== undefined;
    entry = localEventListeners.pop()
  ) {
    let { node, type, callback } = entry;
    if (node !== undefined) {
      node.removeEventListener(type, callback);
    }
  }
  if (localEventListeners.length > 0) {
    console.log(`💂 removed ${localEventListeners.length} local event listeners.`);
  }
});

// checkme

window.layoutWindowAddEventListener = window.addEventListener;

window.addEventListener = function (
  /** @type {string} */ type,
  /** @type {EventListenerOrEventListenerObject} */ callback,
  /** @type {boolean | AddEventListenerOptions | undefined} */ options
) {
  localEventListeners.push({ node: this, type, callback });
  window.layoutWindowAddEventListener.call(this, type, callback, options);
};

window.layoutAddEventListener = Node.prototype.addEventListener;

Node.prototype.addEventListener = function (
  /** @type {string} */ type,
  /** @type {EventListenerOrEventListenerObject} */ callback,
  /** @type {boolean | AddEventListenerOptions | undefined} */ options
) {
  localEventListeners.push({ node: this, type, callback });
  window.layoutAddEventListener.call(this, type, callback, options);
};

console.log('💂 events module ready.');
