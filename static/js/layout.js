/**
 * @file Main script. Loads other modules.
 * @author Jordan Mann
 */
import './lib/face.js';
import './lib/routing.js';
import './lib/interactive.js';

document.querySelectorAll('[data-needs-js]').forEach((el) => el.removeAttribute('hidden'));
