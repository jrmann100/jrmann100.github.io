/**
 * @file Main script. Loads other modules.
 * @author Jordan Mann
 */
import './lib/face.js';
import './lib/routing.js';
import './lib/interactive.js';

// enable components which require javascript.
document.querySelectorAll('[data-needs-js]').forEach((el) => el.removeAttribute('hidden'));

/** @type {HTMLDetailsElement | null} */
let _currentMenu = null;

/**
 * Get and/or set the currently-open menu; if a menu was open, close it.
 *
 * @param {Element | null} set the menu that is currently open, or null if no menu is open.
 * @returns {HTMLDetailsElement | null} the currently-open menu.
 */
document.querySelectorAll('header nav > ul > li > details').forEach((e) =>
  e.layoutAddEventListener('toggle', (ev) => {
    if (e instanceof HTMLDetailsElement) {
      if (e.open) {
        if (_currentMenu !== null && _currentMenu !== e) {
          _currentMenu.open = false;
        }
        _currentMenu = e;
      }
    }
  })
);

/**
 *
 */
function close() {
  if (_currentMenu !== null) {
    _currentMenu.open = false;
  }
  _currentMenu = null;
}

// hide menu
document.querySelector('main')?.layoutAddEventListener('click', close);
document.layoutAddEventListener('navigate', close);
