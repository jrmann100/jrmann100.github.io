// parts of the page to hydrate.
const regions = ["head", "main"];

// number of times the user has navigated.
let count = 0;

// handle history navigation within the page.
window.addEventListener("popstate", ev => {
    console.log(`[popstate] ${window.location.pathname}`);
    load(window.location.pathname);
});

// page transitions, like a slideshow.
const animations = {
    swing: {
        in: [{
            transform: "translate(80vw)",
            opacity: "0"
        },
        {
            transform: "translate(0vw)",
            opacity: "1"
        }], out: [{
            transform: "translate(0vw)",
            opacity: "1"
        }, {
            transform: "translate(-80vw)",
            opacity: "0"
        }]
    },
    flipX: {
        in: [{
            transform: "rotateX(-90deg)",
        },
        {
            transform: "rotateX(0deg)",
        }], out: [{
            transform: "rotateX(0deg)",
            opacity: "1"
        }, {
            transform: "rotateX(90deg)",
        }]
    },
    spin: {
        in: [{
            transform: "rotate(-90deg) scale(0.5)",
            opacity: "0"
        },
        {
            transform: "rotate(0deg) scale(1)",
            opacity: "1"
        }], out: [{
            transform: "rotate(0deg) scale(1)",
            opacity: "1"
        }, {
            transform: "rotate(90deg) scale(0.5)",
            opacity: "0"
        }]
    },
    flipY: {
        in: [{
            transform: "rotateY(-90deg)",
        },
        {
            transform: "rotateY(0deg)",
        }], out: [{
            transform: "rotateY(0deg)",
            opacity: "1"
        }, {
            transform: "rotateY(90deg)",
        }]
    },
}

// remove the dynamically-populated section of the head.
function repopulate(label, content) {

    console.log("repopulating", label)
    const commentsIterator = document.createNodeIterator(
        document.documentElement,
        NodeFilter.SHOW_COMMENT,
        { acceptNode(node) { return regions.includes(node.nodeValue.replace(/^\//,"")) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT } }
    );
    let comments = [];
    for (let node = commentsIterator.nextNode(); node !== null; node = commentsIterator.nextNode()) comments.push(node);
    console.log(comments);
    // <!--label-->
    let start = comments.find(n => n.nodeValue === label);
    // <!--/label-->
    let end = comments.find(n => n.nodeValue === "/" + label);
    // remove the range if it exists.
    if (start !== undefined && end !== undefined) {
        const range = document.createRange();
        range.setStartBefore(start);
        range.setEndAfter(end);
        range.deleteContents();
        range.insertNode(dynamify(document.createRange().createContextualFragment(content)));
    }
}

// stand-in for mutating strings. use as [textWithoutTargetContent, TargetContent] = textWithout(textWithTargetContent, regexMatchingTargetContent)
function textWithout(text, regex) {
    let without;
    text = text.replace(regex, match => { without = match; return "" });
    return [text, without];
}

// todo: will need to seriously error-test this.
// re-populate the head and body with dynamically-loaded content.
function switcheroo(text) {
    regions.forEach((label => {
        let content;
        [text, content] = textWithout(text, new RegExp(`<!--${label}-->(.|\n)*<!--\/${label}-->`));
        console.log(content);
        if (content != undefined) repopulate(label, content);
    }));
}

// main function. loads a page fragment for a given path and hydrates its content.
async function load(path) {
    const text = await (await fetch(path.replace(".html", ".html.inc"))).text(); // todo: fallback

    const animation = Object.values(animations)[count++ % Object.keys(animations).length];

    // animate out, wait until complete, then switch content and animate in.
    // todo: could clone the new content and actually swap it, but that's a lot of work.
    // make sure to respect the user's choice if they don't want to see animations.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        setTimeout(() => {

            switcheroo(text);
            document.querySelector("main#layout").animate(
                animation.in, {
                duration: 500,
                fill: "forwards",
                easing: "ease-out"
            }
            )
        }, document.querySelector("main#layout").animate(
            animation.out, {
            duration: 500,
            fill: "forwards",
            easing: "ease-in"
        }
        ).effect.getComputedTiming().duration);
    else switcheroo(text);
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