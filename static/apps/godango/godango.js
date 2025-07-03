/**
 * @file Godango helper. Generates passphrases.
 * @author Jordan Mann
 */

import machineMain from './machine.js';

const storageKey = 'godango-defaults';

const UINT32_RANGE = 0x100000000; // 2^32
/**
 *
 * For performance this function ASSUMES that min and max are integers,
 * that min <= max,
 * and that max - min < UINT32_RANGE.
 * @param {number} min the minimum integer value to generate, inclusive.
 * @param {number} max the maximum integer value to generate, inclusive.
 * @returns {number} a random integer on [min, max].
 */
const randomUintBetween = (min, max) => {
  // suppose we are trying to model a 4-sided die.
  // then the values we can generate are 1, 2, 3, and 4.
  // the total range of values we can generate is (4 - 1) + 1 = 4.
  const buckets = max - min + 1;

  // the problem is that crypto.getRandomValues() generates a random number on [0, 2^32).
  // this is like having only a 10-sided die.

  // our first instinct might be to just modulo the result by the number of buckets. that means:
  // rolling 1, 5, 9  gives us a 1;
  // rolling 2, 6, 10 gives us a 2;
  // rolling 3, 7     gives us a 3;
  // rolling 4, 8     gives us a 4.
  // but wait! that's not an even distribution!
  // it's twice as likely to roll a 1 or a 2 than it is to roll a 3 or a 4.
  // we need to roll again excluding values 9 and 10 so the number of buckets divides evenly into the range of values.
  // in this case, that's a remainder of (10 % 4) = 2 values excluded.
  const limit = UINT32_RANGE - (UINT32_RANGE % buckets);

  // so keep rolling until we get a value less than 9.
  let int;
  do {
    int = window.crypto.getRandomValues(new Uint32Array(1))[0];
  } while (int >= limit);

  // now we can safely modulo.
  return min + (int % buckets);

  // this process is known as rejection sampling!
  // also see this thread: https://stackoverflow.com/a/18230432/9068081
};

/**
 * Get a random word by simulating six dice rolls.
 * @typedef { string[] } wordlist
 * @param {wordlist} words the list of words to choose from using dice.
 * @returns {string} a random word.
 */
function word(words) {
  return words[randomUintBetween(0, words.length - 1)];
}

const NUM_DIGITS = 10;
/**
 * Get a random digit 0-9.
 * @returns {number} a random number on [0,10).
 */
function number() {
  return randomUintBetween(0, NUM_DIGITS - 1);
}

const NUM_LETTERS = 26;
/**
 * Get a random letter.
 * @param {boolean} capital whether the letter should be capitalized.
 * @returns {string} a random letter.
 */
function letter(capital = true) {
  return String.fromCharCode((capital ? 65 : 97) + randomUintBetween(0, NUM_LETTERS - 1));
}

/**
 * Get a random 'secret sauce' composed of one capital letter and one number.
 * @returns {string} the sauce.
 */
function sauce() {
  return `${number()}${letter()}`;
}

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
  WORDLIST: './eff_large_wordlist.txt',
  OPTIONS_OPEN: false
};

/**
 * Bundle random words into a dumpling and add some special sauce.
 * @param {wordlist} words the list of words to choose from using dice.
 * @returns {string} a word dumpling!
 */
function godango(words) {
  return (
    Array.from(
      {
        length: defaults.COUNT
      },
      () => word(words)
    ).join(defaults.SEPARATOR) +
    (defaults.SAUCE_TYPE !== 'none'
      ? `${defaults.COUNT > 0 ? defaults.SEPARATOR : ''}${
          defaults.SAUCE_TYPE === 'custom' ? defaults.SAUCE_VALUE : sauce()
        }`
      : '')
  );
}

/**
 * Calculate the entropy of a word dumpling.
 * @param {number} wordsLength the number of words to choose from.
 * @returns {number} the entropy, in number of bits.
 */
function entropy(wordsLength) {
  return Math.round(
    Math.log2(
      Math.pow(wordsLength, defaults.COUNT) *
        (defaults.SAUCE_TYPE === 'random' ? NUM_DIGITS * NUM_LETTERS : 1)
    )
  );
}

/**
 * Make UI responsive.
 */
export default async function main() {
  machineMain();
  /**
   * Word list. Make sure to cache this.
   * @see {@link https://www.eff.org/dice}
   */
  const text = await (
    await fetch('/static/data/eff_large_wordlist.txt', {
      cache: 'force-cache'
    })
  ).text();

  /** Parsed wordlist, matching 6-digit numbers to words. */
  const words = [...text.matchAll(/\d+\t(\w+)\n/g)].map(([, word]) => word);

  const form = document.querySelector('form.godango');
  if (form === null) {
    throw new Error('could not find form');
  }
  /** @type {HTMLDetailsElement | null} */
  const optionsDetails = document.querySelector('details.options');
  /** @type {HTMLInputElement | null} */
  const outputBox = form.querySelector('input[name=output]');
  /** @type {HTMLInputElement | null} */

  const entropyBox = form.querySelector('input[name=entropy]');
  /** @type {HTMLInputElement | null} */

  const lengthBox = form.querySelector('input[name=length]');
  /** @type {HTMLInputElement | null} */
  const copyButton = form.querySelector('input[name=copy]');
  /** @type {HTMLInputElement | null} */
  const editButton = form.querySelector('input[name=edit]');
  const lastBox = document.querySelector('textarea');
  /**
   * @type {string[]}
   */
  const prevDango = [];

  /** @type {HTMLInputElement | null} */
  const countInput = form.querySelector('input[name=count]');
  /** @type {HTMLInputElement | null} */
  const separatorInput = form.querySelector('input[name=separator]');
  /** @type {NodeListOf<HTMLInputElement>} */
  const sauceRadios = form.querySelectorAll('input[name=sauce-type]');
  /** @type {HTMLInputElement | null} */
  const sauceInput = form.querySelector('input[name=sauce-value]');

  if (editButton === null) {
    throw new Error('could not find the edit button');
  }

  editButton.addEventListener('click', () => setEditMode());

  /**
   * Return whether the output box is editable.
   * @returns {boolean} edit mode.
   */
  function getEditMode() {
    if (outputBox === null) {
      throw new Error('could not find output box');
    }
    return !outputBox.readOnly;
  }

  /**
   * Set whether the output box is editable.
   * @param {boolean} on edit mode.
   */
  function setEditMode(on = true) {
    if (editButton === null || outputBox === null) {
      throw new Error('could not find required status element(s)');
    }
    editButton.disabled = on;
    outputBox.readOnly = !on;
    if (on) {
      outputBox.focus();
      /**
       * We want to insert the cursor *before* the sauce,
       * since that should be a constant. So, figure out
       * where the end is, and subtract the sauce length
       * (which may be 0 if there is no sauce).
       */
      const end =
        outputBox.value.length -
        (defaults.SAUCE_TYPE !== 'none'
          ? defaults.SAUCE_VALUE.length + defaults.SEPARATOR.length
          : 0);
      outputBox.setSelectionRange(end, end);
    }
  }

  /**
   * Generate a passphrase and update the UI to display it.
   */
  function create() {
    if (outputBox == null || entropyBox == null || lengthBox == null || lastBox == null) {
      throw new Error('could not find required status element(s)');
    }
    setEditMode(false);
    outputBox.value = godango(words);
    entropyBox.value = entropy(words.length).toString();
    lengthBox.value = outputBox.value.length.toString();
    outputBox.focus();
    outputBox.select();
    lastBox.value = [...prevDango].reverse().join('\n');
    prevDango.push(outputBox.value);
    if (prevDango.length > lastBox.rows) {
      prevDango.shift();
    }
  }

  /**
   * Update user settings.
   * @param {boolean} [doCreate] make a passphrase with the updated settings
   * (usually where the changed settings would result a different kind of passphrase being made.)
   */
  function updateDefaults(doCreate = true) {
    localStorage.setItem(storageKey, JSON.stringify(defaults));
    if (doCreate) {
      create();
    }
  }

  const defaultsString = localStorage.getItem(storageKey);
  if (defaultsString !== null) {
    defaults = JSON.parse(defaultsString);
  }

  if (optionsDetails === null || countInput === null || separatorInput === null) {
    throw new Error('could not find required element(s) for setting preferences');
  }

  optionsDetails.addEventListener('toggle', () => {
    defaults.OPTIONS_OPEN = optionsDetails.open;
    updateDefaults(false);
  });
  optionsDetails.open = defaults.OPTIONS_OPEN;

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

  sauceInput.addEventListener('change', () => {
    defaults.SAUCE_VALUE = sauceInput.value;
    updateDefaults();
  });
  sauceInput.value = defaults.SAUCE_VALUE;
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

  if (outputBox === null) {
    throw new Error('could not find the output box');
  }

  outputBox.addEventListener('click', () => {
    if (!getEditMode()) {
      outputBox.select();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    create();
  });

  if (copyButton === null) {
    throw new Error('could not find the copy button');
  }

  copyButton.addEventListener('click', () => {
    outputBox.select();
    document.execCommand('copy');
  });
  create();

  outputBox.addEventListener('input', () => {
    if (entropyBox == null || lengthBox == null) {
      throw new Error('could not find required status element(s)');
    }
    if (getEditMode()) {
      entropyBox.value = '???';
      lengthBox.value = outputBox.value.length.toString();
    }
  });
}
