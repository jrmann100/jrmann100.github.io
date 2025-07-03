import words from './words.js';

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
 * Get a random word from the wordlist.
 * @returns {string} a random word from the list of {@link words}.
 */
export function word() {
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
export function sauce() {
  return `${number()}${letter()}`;
}

/**
 * Calculate the entropy of a passphrase.
 * @param {number} count the number of words in the passphrase.
 * @param {boolean} sauceIsRandom whether the suffix of the passphrase is randomly generated.
 * @returns {number} the entropy, in number of bits.
 */
export const entropy = (count, sauceIsRandom) =>
  Math.round(
    Math.log2(Math.pow(words.length, count) * (sauceIsRandom ? NUM_DIGITS * NUM_LETTERS : 1))
  );
