// will get dispatched on load().
const event = new Event('navigate');

// matches a label comment's content, i.e. {{/label}}.
const tagRegex = /^{{(\/?.+)}}$/;

// identify regions in a document or fragment by their label comments.
// the regions themselves do not include the labels, only their enclosed content.
async function locateRegions(root) {
    const commentsIterator = document.createNodeIterator(
        root,
        NodeFilter.SHOW_COMMENT,
        { acceptNode(node) { return node.nodeValue.match(tagRegex) !== null ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT } }
    );

    // label: Range
    let regions = {};

    let start, end;

    // take matching labels two at a time and convert them into ranges enclosing content.
    while (JSON.stringify([start, end] = [commentsIterator.nextNode(), commentsIterator.nextNode()]) !== "[null,null]") {
        const label = start.nodeValue.match(tagRegex)[1];
        if ("/" + label !== end.nodeValue.match(tagRegex)[1]) throw new Error("document's region tags don't match!", start, end);
        const range = document.createRange();
        range.setStartAfter(start);
        range.setEndBefore(end);
        regions[label] = range;
    };
    return regions;
}
// load a page fragment for a given path and swap the current content with its own.
// todo test with malformed data
async function load(path) {

    // fetch the fragment text.
    let text = await (await fetch(path.replace(".html", ".html.inc"))).text(); // todo fallback
    // turn the fragment into DOM content.
    const contextualFragment = dynamify(document.createRange().createContextualFragment(text));

    // find existing document regions on the page.
    const docRegions = await locateRegions(document.documentElement);

    // clear all document regions.
    Object.values(docRegions).forEach(range => range.deleteContents());

    // match the new fragment regions to cleared document regions with the same label.
    const fragmentRegions = await locateRegions(contextualFragment);
    Object.entries(fragmentRegions).forEach(([label, range]) => {
        if (!Reflect.has(docRegions, label)) throw new Error("could not find document region for fragment region", label);
        docRegions[label].insertNode(range.cloneContents());
    });

    document.body.dispatchEvent(event);
}

// convert hard links into dynamic ones that load() content instead of redirecting.
function dynamify(parent) {
    parent.querySelectorAll("a").forEach(el => {
        // only make relative links dynamic.
        // todo: maybe stat the fragment here?
        if (new URL(el.href).origin === window.location.origin)
            el.addEventListener("click", async ev => {
                ev.preventDefault();
                const path = new URL(el.href).pathname;
                if (window.location.pathname !== path) {
                    console.log(window.location.pathname, "->", path);
                    load(path);
                    window.history.pushState(null, null, el.href);
                } else
                    console.log(window.location.pathname, "x", path);
            })
    });
    return parent;
}

export function setup() {
    // handle history navigation (back, forward).
    window.addEventListener("popstate", _ev => {
        console.log(`[popstate] ${window.location.pathname}`);
        load(window.location.pathname);
    });

    // make all links dynamic, enabling routing.
    dynamify(document.body);
}