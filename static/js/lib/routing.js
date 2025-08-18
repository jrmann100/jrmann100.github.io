/**
 * @file Routing module. Dynamically updates page content from fragments, replacing standard nagivation.
 * @author Jordan Mann
 * @license MIT
 */

import { nextEventLoop } from './util.js';

/**
 * Matches a label comment's content, i.e. {{/label}}.
 */
const tagRegex = /^{{(\/?.+)}}$/;

/**
 * Identify regions in a document or fragment by their label comments.
 * The regions themselves do not include the labels, only their enclosed content.
 * @param {Node} root in which to locate regions.
 * @returns {Promise<Map<string, Range>>} located regions.
 */
async function locateRegions(root) {
  /**
   * Node iterator which scans through all label comment nodes in the page.
   */
  const commentsIterator = document.createNodeIterator(root, NodeFilter.SHOW_COMMENT, {
    /**
     * Filter to only label nodes.
     * @param {Comment} node the node to check.
     * @returns { number } code corresponding to the filter result (accept or reject).
     */
    acceptNode(node) {
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
 * TODO
 */
let lastPathname = window.location.pathname;

/**
 * Load a page fragment for a given path and swap the current content with its own.
 * @param {string} path the relative path to load.
 * @todo error handling
 */
async function load(path) {
  document.dispatchEvent(new CustomEvent('beforenavigate', { detail: { destination: path } }));
  // checkme we are trying to wait for event listeners to these functions to finish
  await nextEventLoop();

  // fetch the fragment text.
  let text = await (await fetch('/fragments/' + path)).text(); // todo fallback
  // turn the fragment into DOM content.
  const contextualFragment = document.createRange().createContextualFragment(text);

  // find existing document regions on the page.
  const docRegions = await locateRegions(document.documentElement);

  docRegions.forEach((range) => range.deleteContents());

  document.dispatchEvent(new CustomEvent('navigate', { detail: { destination: path } }));
  await nextEventLoop();

  // match the new fragment regions to cleared document regions with the same label.
  const fragmentRegions = await locateRegions(contextualFragment);
  fragmentRegions.forEach((range, label) => {
    if (!docRegions.has(label)) {
      throw new Error(`could not find document region for fragment region '${label}'`);
    }
    docRegions.get(label)?.insertNode(dynamify(range.extractContents()));
  });

  lastPathname = window.location.pathname;
  document.dispatchEvent(new CustomEvent('endnavigate', { detail: { destination: path } }));
}

/**
 * Convert hard links into dynamic ones that load() content instead of redirecting.
 * @param {ParentNode} parent the parent element/fragment to transform.
 * @returns {ParentNode} the transformed parent node.
 */
function dynamify(parent) {
  parent.querySelectorAll('a').forEach((/** @type {HTMLAnchorElement} */ el) => {
    // only make relative links dynamic.
    // todo: maybe stat the fragment here?
    if (new URL(el.href).origin === window.location.origin) {
      el.layoutAddEventListener('click', async (ev) => {
        // fixme
        if (!(ev instanceof MouseEvent)) {
          return;
        }
        if (ev.ctrlKey || ev.metaKey) {
          return;
        }
        const path = new URL(el.href).pathname;
        if (path === window.location.pathname) {
          return; // no need to reload the same page - may be hash change.
        }
        ev.preventDefault();
        if (window.location.pathname !== path) {
          console.debug(
            `🔀 ${window.location.pathname.replace('.html', '')} -> ${path.replace('.html', '')}`
          );
          load(path);
          window.history.pushState(
            { scroll: { top: window.scrollY, left: window.scrollX, behavior: 'auto' } },
            '',
            el.href
          );
        } else {
          // console.log(window.location.pathname, 'x', path);
        }
      });
    }
  });
  return parent;
}

// handle history navigation (back, forward).
window.layoutAddEventListener('popstate', (e) => {
  // fixme
  if (!(e instanceof PopStateEvent)) {
    return;
  }

  // hash changes trigger popstate, but don't require navigation.
  if (window.location.pathname === lastPathname) {
    return;
  }

  lastPathname = window.location.pathname;
  console.debug(`🔀 popstate ${window.location.pathname}`);
  load(window.location.pathname);
  if (e.state !== null) {
    const scrollOptions = Reflect.get(e.state, 'scroll');
    if (scrollOptions !== undefined) {
      window.scroll(scrollOptions);
    }
  }
});

// make all links dynamic, enabling routing.
dynamify(document.body);
console.log('🔀 routing module ready.');
