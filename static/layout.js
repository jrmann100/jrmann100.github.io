const main = document.querySelector("main");
main.id = `layout-${new Date().getTime().toString(36)}`;

window.addEventListener("popstate", ev => {
    console.log(`-> ${window.location.pathname}`);
    load(window.location.pathname);
});

// I have no idea how "legal" manipulating live rules is. It works...
// you could also remove and re-insert the rules.
function overrule(rule) {
    if (rule.cssRules) {
        Object.entries(rule.cssRules).forEach(overrule)
    } else if (rule.selectorText) {
        // Pretty sure this regex is too slow... ideally you SSR this out, right?
        rule.selectorText = `main#${main.id} ` + rule.selectorText.replace(/(?!(?<="[^"]*),(?=[^"]*")),/g, `, main#${main.id} `);
    }
    // const parent = rule.parentRule ?? rule.parentStyleSheet;
    // parent.deleteRule(0);
    // parent.insertRule(rule.cssText, 0)
}

async function load(path) {
    document.querySelector("#count").textContent = Number(document.querySelector("#count").textContent) + 1;

    if (path === "/") {
        path = "/index";
    }
    const req = await fetch("/fragments" + path + ".html.inc");
    const body = await req.text();
    const fragment = new DOMParser().parseFromString(body, 'text/html');

    while (main.firstChild) {
        main.firstChild.remove();
    }
    dynamify(fragment.body);
    main.append(...fragment.body.children);

    document.head.querySelectorAll("[data-is-fragment=yes]").forEach(el => el.remove());
    fragment.head.querySelectorAll("*").forEach(el => el.dataset["isFragment"] = "yes");

    const styles = fragment.querySelectorAll("style");
    
    document.head.append(...fragment.head.children);

    // Apparently stylesheets need to be in the DOM to be manipulated.
    styles.forEach(style=>{
        style.innerHTML = "/* Modified dynamically using JS. Styles may not appear as rendered. */\n" + style.innerText
        Object.values(style.sheet.cssRules).forEach(overrule)
    });

}

function dynamify(parent) {
    parent.querySelectorAll("a").forEach(el => {
        el.addEventListener("click", async ev => {
            ev.preventDefault();
            const path = new URL(el.href).pathname;
            if (window.location.pathname !== path) {
                console.table(window.location.pathname, "->", path);
                load(path);
                window.history.pushState(null, null, el.href);
            } else {
                console.table(window.location.pathname, "x", path);
            }
        })
    })
}

dynamify(document.body);

// debug
if (window.location.pathname == '/layout.html') {
    load("/index");
    window.history.replaceState(null, null, "/");
}