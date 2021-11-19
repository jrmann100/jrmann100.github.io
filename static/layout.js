// section of the page that will be populated with content.
const main = document.querySelector("main#layout");
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
function removeDynamicHead() {
    let comments = [...document.head.childNodes].filter(n => n.nodeType === Node.COMMENT_NODE);
    // <!--head-->
    let start = comments.find(n => n.nodeValue === "head");
    // <!--/head-->
    let end = comments.find(n => n.nodeValue === "/head");
    // remove the range if it exists.
    if (start !== undefined && end !== undefined) {
        const range = document.createRange();
        range.setStartBefore(start);
        range.setEndAfter(end);
        range.deleteContents();
    }
}

// re-populate the head and body with dynamically-loaded content.
function switcheroo(text) {
    // distinguish head content, if available, from body content.
    let head;
    const body = text.replace(/<!--head-->(.|\n)*<!--\/head-->/, (match => {
        // the replace() function saves us the step of matching and then removing.
        head = match;
        // we will replace it with nothing.
        return "";
    }));

    // clear existing content.
    removeDynamicHead();
    main.innerHTML = "";

    // populate new content.
    // contextualFragments apparently work with <script> tags.
    if (head != undefined) document.head.appendChild(document.createRange().createContextualFragment(head));

    main.appendChild(dynamify(document.createRange().createContextualFragment(body)));
}

// main function. loads a page fragment for a given path and hydrates its content.
async function load(path) {
    const emoji = ["😶", "😮", "🥱", "🤭", "😶", "😯", "😮‍💨", "😴", "😴", "🥱", "😳", "😊", "🤗"];
    document.querySelector("#emoji").textContent = emoji[count++ % emoji.length];

    const text = await (await fetch(path.replace(".html", ".html.inc"))).text(); // todo: fallback

    const animation = Object.values(animations)[count % Object.keys(animations).length];

    // animate out, wait until complete, then switch content and animate in.
    // todo: could clone the new content and actually swap it, but that's a lot of work.
    // make sure to respect the user's choice if they don't want to see animations.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        setTimeout(() => {

            switcheroo(text);
            main.animate(
                animation.in, {
                duration: 500,
                fill: "forwards",
                easing: "ease-out"
            }
            )
        }, main.animate(
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

// make all links dynamic.
dynamify(document.body);

customElements.define("script-template", class ScriptTemplateElement extends HTMLElement { constructor() { super() } connectedCallback() { this.innerHTML = eval(this.innerText) } })