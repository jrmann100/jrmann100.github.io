/**
 * @file Godango helper. Generates passphrases.
 * @author Jordan Mann
 */

import GodangoMachine from './GodangoMachine.js';

/**
 *
 * @param {Element} root
 * @returns
 */
const getElements = (root) => {
  const nullableElements = {
    copyButton: root.querySelector('[name=copy]'),
    configureButton: root.querySelector('[name=configure]')
  };
  for (const [name, element] of Object.entries(nullableElements)) {
    if (element === null) {
      throw new Error(`could not find ${name}`);
    }
  }

  const elements =
    /** @type {{ [K in keyof typeof nullableElements]: NonNullable<typeof nullableElements[K]> }} */ (
      nullableElements
    );

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

  let configuring = false;
  elements.configureButton.addEventListener('click', () => {
    configuring = !configuring;
    machine.configure(configuring);
  });
}
