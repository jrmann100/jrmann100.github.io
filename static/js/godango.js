const storageKey = 'godango-defaults';

/**
 *
 */
function randomUint8() {
  if (window.crypto) {
    return window.crypto.getRandomValues(new Uint8Array(1))[0];
  } else {
    return Math.floor(Math.random() * 256);
  }
}

/**
 *
 */
function roll() {
  return 1 + (randomUint8() % 6);
}

/**
 *
 */
function number() {
  return randomUint8() % 10;
}

/**
 *
 * @param capital
 */
function letter(capital = true) {
  return String.fromCharCode((capital ? 65 : 97) + (randomUint8() % 26));
}

/**
 *
 * @param words
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
 *
 */
function sauce() {
  return `${number()}${letter()}`;
}

let defaults = {
  COUNT: 4,
  SAUCE_TYPE: 'random',
  SAUCE_VALUE: sauce(),
  SEPARATOR: '-',
  WORDLIST: './eff_large_wordlist.txt',
  OPTIONS_OPEN: false
};

/**
 *
 * @param words
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
 *
 */
function entropy() {
  return Math.round(
    Math.log2(
      Math.pow(Math.pow(6, 5), defaults.COUNT) * (defaults.SAUCE_TYPE === 'random' ? 10 * 26 : 1)
    )
  );
}

/**
 *
 */
export async function main() {
  // https://www.eff.org/dice
  const text = await (
    await fetch('/static/data/eff_large_wordlist.txt', {
      cache: 'force-cache'
    })
  ).text();

  const words = Object.fromEntries(
    [...text.matchAll(/(\d+)\t(\w+)\n/g)].map(([_, number, word]) => [number, word])
  );

  const form = document.querySelector('form');
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
    summary.textContent = '?????? unsafe mode';
    warning.appendChild(summary);
    document.querySelector('main')?.insertAdjacentElement('afterbegin', warning);
  }

  /**
   *
   */
  function create() {
    if (outputBox == null || entropyBox == null || lengthBox == null || lastBox == null) {
      throw new Error('could not find required status element(s)');
    }
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
   *
   * @param doCreate
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
   *
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
      defaults.SAUCE_TYPE = radio.value;
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

  outputBox.addEventListener('click', () => outputBox.select());
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
}
