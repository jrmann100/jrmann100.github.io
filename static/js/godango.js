/**
 * @file Godango helper. Generates word dumplings.
 * @author Jordan Mann
 */
const storageKey = 'godango-defaults';

/**
 * Get a random number.
 * Tries to use window.crypto, which is stronger than Math.random().
 *
 * @returns {number} a random number on [0,256).
 */
function randomUint8() {
  if (window.crypto) {
    return window.crypto.getRandomValues(new Uint8Array(1))[0];
  } else {
    return Math.floor(Math.random() * 256);
  }
}

/**
 * Simulate a dice roll.
 *
 * @returns {number} a random number on [1,6].
 */
function roll() {
  return 1 + (randomUint8() % 6);
}

/**
 * Get a random digit 0-9.
 *
 * @returns {number} a random number on [0,10).
 */
function number() {
  return randomUint8() % 10;
}

/**
 * Get a random letter.
 *
 * @param {boolean} capital whether the letter should be capitalized.
 * @returns {string} a random letter.
 */
function letter(capital = true) {
  return String.fromCharCode((capital ? 65 : 97) + (randomUint8() % 26));
}

/**
 * Get a random word by simulating six dice rolls.
 *
 * @typedef { Object<string,string> } wordlist
 * @param {wordlist} words the list of words to choose from using dice.
 * @returns {string} a random word.
 */
function word(words) {
  return words[
    Array.from(
      {
        length: 5
      },
      roll
    ).join('')
  ];
}

/**
 * Get a random 'secret sauce' composed of one capital letter and one number.
 *
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
  COUNT: 3,
  /** @type {'custom' | 'random' | 'none'} */
  SAUCE_TYPE: 'custom',
  SAUCE_VALUE: sauce(),
  SEPARATOR: '-',
  WORDLIST: './eff_large_wordlist.txt',
  OPTIONS_OPEN: false
};

/**
 * Bundle random words into a dumpling and add some special sauce.
 *
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
 *
 * @returns {number} the entropy, in number of bits.
 */
function entropy() {
  return Math.round(
    Math.log2(
      Math.pow(Math.pow(6, 5), defaults.COUNT) * (defaults.SAUCE_TYPE === 'random' ? 10 * 26 : 1)
    )
  );
}

/**
 * Make UI responsive.
 */
export async function main() {
  /**
   * Word list. Make sure to cache this.
   *
   * @see {@link https://www.eff.org/dice}
   */
  const text = await (
    await fetch('/static/data/eff_large_wordlist.txt', {
      cache: 'force-cache'
    })
  ).text();

  /** Parsed wordlist, matching 6-digit numbers to words. */
  const words = Object.fromEntries(
    [...text.matchAll(/(\d+)\t(\w+)\n/g)].map(([, number, word]) => [number, word])
  );

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

  if (!window.crypto) {
    const warning = document.createElement('details');
    warning.style.color = 'orange';
    warning.innerText =
      "Your browser doesn't support Web Crypto. Passwords generated may not be cryptographically secure (we can't make them random enough).";
    const summary = document.createElement('summary');
    summary.textContent = '⚠️ unsafe mode';
    warning.appendChild(summary);
    document.querySelector('main')?.insertAdjacentElement('afterbegin', warning);
  }

  if (editButton === null) {
    throw new Error('could not find the edit button');
  }

  editButton.addEventListener('click', () => setEditMode());

  /**
   * Return whether the output box is editable.
   *
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
   *
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
   * Generate a word dumpling and update the UI to display it.
   */
  function create() {
    if (outputBox == null || entropyBox == null || lengthBox == null || lastBox == null) {
      throw new Error('could not find required status element(s)');
    }
    setEditMode(false);
    outputBox.value = godango(words);
    entropyBox.value = entropy().toString();
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
   *
   * @param {boolean} doCreate make a word dumpling with the updated settings
   * (usually where the changed settings would result a different kind of dumpling being made.)
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

  optionsDetails.addEventListener('toggle', (_) => {
    defaults.OPTIONS_OPEN = optionsDetails.open;
    updateDefaults(false);
  });
  optionsDetails.open = defaults.OPTIONS_OPEN;

  countInput.addEventListener('change', (_) => {
    defaults.COUNT = parseInt(countInput.value);
    updateDefaults();
  });
  countInput.value = defaults.COUNT.toString();

  separatorInput.addEventListener('change', (_) => {
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

  sauceInput.addEventListener('change', (_) => {
    defaults.SAUCE_VALUE = sauceInput.value;
    updateDefaults();
  });
  sauceInput.value = defaults.SAUCE_VALUE;
  tryDisableCustomSauce();

  sauceRadios.forEach((radio) =>
    radio.addEventListener('change', (_) => {
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
