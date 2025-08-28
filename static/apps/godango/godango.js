/**
 * @file Godango helper. Generates passphrases.
 * @author Jordan Mann
 */

import GodangoMachine from './GodangoMachine.js';

/**
 * Query the DOM for core elements of the app.
 * @param {Element} root the component which wraps the godango app.
 * @returns { { copyButton: HTMLButtonElement } } the core elements of the app.
 */
const getElements = (root) => {
  const nullableElements = {
    copyButton: /** @type {HTMLButtonElement} */ (root.querySelector('button[name=copy]'))
  };
  for (const [name, element] of Object.entries(nullableElements)) {
    if (element === null) {
      throw new Error(`could not find ${name}`);
    }
  }
  /**
   * @typedef { { [K in keyof typeof nullableElements]: NonNullable<typeof nullableElements[K]> }} Elements
   */
  const elements = /** @type {Elements} */ (nullableElements);

  return elements;
};

/**
 * Make UI responsive.
 */
export default async function main() {
  const root = document.querySelector('.godango-app');
  if (root === null) {
    throw new Error('could not find godango app root component');
  }
  const machine = new GodangoMachine(root);

  const elements = getElements(root);

  elements.copyButton.addEventListener('click', async () => {
    await navigator.clipboard.writeText(machine.getPassphrase().join('-'));
  });
}
