/**
 * @file Replaces standard navigation with dynamic content injection.
 * @module routing
 * @author Jordan Mann
 */

/**
 * Matches a label comment's content, i.e. {{/label}}.
 */
const tagRegex = /^{{(\/?.+)}}$/;

/**
 * Identify regions in a document or fragment by their label comments.
 * The regions themselves do not include the labels, only their enclosed content.
 *
 * @param {Node} root in which to locate regions.
 * @returns {Promise<Map<string, Range>>} located regions.
 */
async function locateRegions(root) {
  const commentsIterator = document.createNodeIterator(root, NodeFilter.SHOW_COMMENT, {
    acceptNode(/** @type {Comment} */ node) {
      return node.nodeValue?.match(tagRegex) !== null
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    }
  });

  let regions = new Map();

  // take matching labels two at a time and convert them into ranges enclosing content.
  for (
    let [start, end] = [commentsIterator.nextNode(), commentsIterator.nextNode()];
    start !== null && end !== null;
    [start, end] = [commentsIterator.nextNode(), commentsIterator.nextNode()]
  ) {
    const label = start.nodeValue?.match(tagRegex)?.[1];
    if ('/' + label !== end.nodeValue?.match(tagRegex)?.[1]) {
      throw new Error(`document's region tags don't match: '${start}' and '${end}'`);
    }
    const range = document.createRange();
    range.setStartAfter(start);
    range.setEndBefore(end);
    regions.set(label, range);
  }
  return regions;
}

/**
 * Load a page fragment for a given path and swap the current content with its own.
 *
 * @param {string} path the relative path to load.
 * @todo error handling
 */
async function load(path) {
  // fetch the fragment text.
  let text = await (await fetch('/fragments/' + path.replace('.html', '.html.inc'))).text(); // todo fallback
  // turn the fragment into DOM content.
  const contextualFragment = document.createRange().createContextualFragment(text);

  // find existing document regions on the page.
  const docRegions = await locateRegions(document.documentElement);

  // clear all document regions.
  docRegions.forEach((range) => range.deleteContents());

  // match the new fragment regions to cleared document regions with the same label.
  const fragmentRegions = await locateRegions(contextualFragment);
  fragmentRegions.forEach((range, label) => {
    if (!docRegions.has(label)) {
      throw new Error(`could not find document region for fragment region '${label}'`);
    }
    docRegions.get(label)?.insertNode(dynamify(range.cloneContents()));
  });
  // todo: this is redundant, but I can't figure out how to add the event listeners to the fragment.
  // dynamify(document.body);
  document.documentElement.dispatchEvent(
    new CustomEvent('navigate', { detail: { destination: path } })
  );

  // todo I hadn't considered how scrolling would be a serious issue when routing.
  // setTimeout(() => document.documentElement.scrollTo({ top: 0, behavior: 'auto' }));
}

/**
 * Convert hard links into dynamic ones that load() content instead of redirecting.
 *
 * @param {ParentNode} parent the parent element/fragment to transform.
 * @returns {ParentNode} the transformed parent node.
 */
function dynamify(parent) {
  parent.querySelectorAll('a').forEach((/** @type {HTMLAnchorElement} */ el) => {
    // only make relative links dynamic.
    // todo: maybe stat the fragment here?
    if (new URL(el.href).origin === window.location.origin) {
      el.addEventListener('click', async (/** @type {{ preventDefault: () => void; }} */ ev) => {
        ev.preventDefault();
        const path = new URL(el.href).pathname;
        if (window.location.pathname !== path) {
          console.log(window.location.pathname, '->', path);
          load(path);
          window.history.pushState(null, '', el.href);
        } else {
          console.log(window.location.pathname, 'x', path);
        }
      });
    }
  });
  return parent;
}

// handle history navigation (back, forward).
window.addEventListener('popstate', () => {
  console.log(`[popstate] ${window.location.pathname}`);
  load(window.location.pathname);
});

// make all links dynamic, enabling routing.
dynamify(document.body);
