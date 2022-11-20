/**
 * @file Main script. Loads other modules.
 * @author Jordan Mann
 */
import './lib/face.js';
import './lib/routing.js';
import './lib/interactive.js';

// enable components which require javascript.
document.querySelectorAll('[data-needs-js]').forEach((el) => el.removeAttribute('hidden'));

document.querySelectorAll('.fake-summary').forEach((el) => {
  el.layoutAddEventListener('mousedown', (ev) => {
    console.log('click');
    ev.preventDefault();
    if (el.parentElement.matches(':focus-within')) {
      el.parentElement.blur();
    } else {
      el.parentElement.focus();
    }
  });
});
