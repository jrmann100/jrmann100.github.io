/**
 * @file Main script. Loads other modules.
 * @author Jordan Mann
 */
import './lib/face.js';
import './lib/routing.js';
import './lib/interactive.js';
import checkNeeds from './lib/checkNeeds.js';

checkNeeds();
document.layoutAddEventListener('endnavigate', () => {
  checkNeeds();
});
