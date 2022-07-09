/**
 * @file Main script. Loads other modules.
 * @author Jordan Mann
 * @copyright 2022
 * @license MIT
 */
import './lib/face.js';
import './lib/routing.js';

document.querySelectorAll('[hidden="needs-js"]').forEach((el) => el.removeAttribute('hidden'));
