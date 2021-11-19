
// handle history navigation within the page.
window.addEventListener("popstate", ev => {
    console.log(`[popstate] ${window.location.pathname}`);
    load(window.location.pathname);
});

const regionRegex = /<!--{{(?<open>.+)}}-->(?<content>(.|\n)*?)<!--{{(?<close>\/.+)}}-->/i;
const tagRegex = /^{{(\/?.+)}}$/;


// this needs to be error-tested and documented. EXTENSIVELY.
async function load(path) {

    let text = await (await fetch(path.replace(".html", ".html.inc"))).text(); // todo: fallback

    const commentsIterator = document.createNodeIterator(
        document.documentElement,
        NodeFilter.SHOW_COMMENT,
        { acceptNode(node) { return node.nodeValue.match(tagRegex) !== null ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT } }
    );
    let docRegions = {};
    let start, end;
    for (
        [start, end] = [commentsIterator.nextNode(), commentsIterator.nextNode()];
        start !== null && end !== null;
        [start, end] = [commentsIterator.nextNode(), commentsIterator.nextNode()]) {
        const label = start.nodeValue.match(tagRegex)[1];
        if ("/" + label !== end.nodeValue.match(tagRegex)[1]) throw new Error("document's region tags don't match!", start, end);
        const range = document.createRange();
        range.setStartAfter(start);
        range.setEndBefore(end);
        range.deleteContents();
        if (label === "main") updateMainHeight(); // todo
        docRegions[label] = range;
    }


    let region;
    while ((region = regionRegex.exec(text)) !== null) {
        text = text.substring(0, region.index) + text.substring(region.index + region[0].length);
        if (!("/" + region.groups?.open === region.groups?.close)) throw new Error("fragment's region tags don't match!", region.groups?.open, region.groups?.close);
        const label = region.groups?.open;
        console.log("rendering region", region.groups?.open);
        if (!Reflect.has(docRegions, label)) throw new Error("could not find document region for fragment region", label);
        docRegions[label].insertNode(dynamify(docRegions[label].createContextualFragment(region.groups?.content)));
        if (label === "main") updateMainHeight(); // todo
    }
    if (text.length < 0) console.warn("Template content found out of a region:", text);
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

// make all links dynamic, enabling routing.
dynamify(document.body);

// todo fadeout content without frame
async function asyncAnimate(el, frames) {
    return new Promise(res => setTimeout(res,
        el.animate(
            frames, {
            duration: 500,
            fill: "forwards",
            easing: "ease-out"
        }
        ).effect.getComputedTiming().duration));
}

const fadeout = [{
    opacity: "1",
},
{
    opacity: "0",
}];

const fadein = [{
    opacity: "0",
},
{
    opacity: "1",
}];

function updateMainHeight() { document.querySelector("main#layout").style.setProperty("--main-height", document.querySelector("main#layout").getBoundingClientRect().height + "px"); }
updateMainHeight();