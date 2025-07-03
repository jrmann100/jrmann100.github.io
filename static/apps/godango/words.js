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
export default [...text.matchAll(/\d+\t(\w+)\n/g)].map(([, word]) => word);
