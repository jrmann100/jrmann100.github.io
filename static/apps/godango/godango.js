/**
 * @file Godango helper. Generates passphrases.
 * @author Jordan Mann
 */

import GodangoMachine from './GodangoMachine.js';
import { entropy, sauce } from './math.js';

const storageKey = 'godango-defaults';

/**
 * Default settings, to which settings will be initialized
 * if they are not recovered from localStorage.
 */
let defaults = {
  COUNT: 6,
  /** @type {'custom' | 'random' | 'none'} */
  SAUCE_TYPE: 'custom',
  SAUCE_VALUE: '-' + sauce(),
  SEPARATOR: '',
  WORDLIST: './eff_large_wordlist.txt'
};

/**
 * Make UI responsive.
 */
export default async function main() {
  const form = document.querySelector('.godango-form');
  if (form === null) {
    throw new Error('could not find form');
  }
  const machine = new GodangoMachine(form);

  /** @type {HTMLInputElement | null} */
  const entropyBox = form.querySelector('input[name=entropy]');

  /** @type {HTMLInputElement | null} */
  const copyButton = form.querySelector('input[name=copy]');

  /** @type {HTMLInputElement | null} */
  const countInput = form.querySelector('input[name=count]');
  /** @type {HTMLInputElement | null} */
  const separatorInput = form.querySelector('input[name=separator]');
  /** @type {NodeListOf<HTMLInputElement>} */
  const sauceRadios = form.querySelectorAll('input[name=sauce-type]');
  /** @type {HTMLInputElement | null} */
  const sauceInput = form.querySelector('input[name=sauce-value]');

  /** @type {HTMLDivElement | null} */
  const sauceReel = form.querySelector('.sauce .face');

  /**
   * Update user settings.
   * @param {boolean} [doCreate] make a passphrase with the updated settings
   * (usually where the changed settings would result a different kind of passphrase being made.)
   */
  function updateDefaults(doCreate = true) {
    localStorage.setItem(storageKey, JSON.stringify(defaults));
    if (entropyBox == null) {
      throw new Error('could not find required status element(s)');
    }
    entropyBox.value = entropy(defaults.COUNT, defaults.SAUCE_TYPE === 'custom').toString();
    // TODO: maybe move everything into the machine…
    // machine.setConstantLength(defaults.COUNT * defaults.SEPARATOR.length);
    // TODO: docreate
    if (doCreate) {
      // machine.click();
    }
  }

  const defaultsString = localStorage.getItem(storageKey);
  if (defaultsString !== null) {
    defaults = JSON.parse(defaultsString);
  }

  if (countInput === null || separatorInput === null) {
    throw new Error('could not find required element(s) for setting preferences');
  }

  countInput.addEventListener('change', () => {
    defaults.COUNT = parseInt(countInput.value);
    updateDefaults();
  });
  countInput.value = defaults.COUNT.toString();

  separatorInput.addEventListener('change', () => {
    defaults.SEPARATOR = separatorInput.value;
    updateDefaults();
  });
  separatorInput.value = defaults.SEPARATOR;

  /**
   * Disable the sauce input if not in custom sauce mode.
   */
  function tryDisableCustomSauce() {
    if (sauceInput === null) {
      throw new Error('could not find the sauce input');
    }
    sauceInput.disabled = defaults.SAUCE_TYPE !== 'custom';
  }

  if (sauceInput === null) {
    throw new Error('could not find the sauce input');
  }

  if (sauceReel === null) {
    throw new Error('could not find the sauce reel');
  }

  sauceInput.addEventListener('change', () => {
    defaults.SAUCE_VALUE = sauceInput.value;
    sauceReel.textContent = defaults.SAUCE_VALUE;
    updateDefaults();
  });
  sauceInput.value = defaults.SAUCE_VALUE;
  sauceReel.textContent = defaults.SAUCE_VALUE;
  tryDisableCustomSauce();

  sauceRadios.forEach((radio) =>
    radio.addEventListener('change', () => {
      if (radio.value === 'custom' || radio.value === 'random' || radio.value === 'none') {
        defaults.SAUCE_TYPE = radio.value;
      }
      tryDisableCustomSauce();
      updateDefaults();
    })
  );

  /** @type {HTMLInputElement | null} */
  const currentSauceType = form.querySelector(
    `input[name=sauce-type][value=${defaults.SAUCE_TYPE}]`
  );
  if (currentSauceType) {
    currentSauceType.checked = true;
  }

  if (copyButton === null) {
    throw new Error('could not find the copy button');
  }

  copyButton.addEventListener('click', async () => {
    await navigator.clipboard.writeText(
      machine.getPassphrase().join(defaults.SEPARATOR) + defaults.SAUCE_VALUE
    );
    // outputBox.select();
    // document.execCommand('copy');
  });
}
