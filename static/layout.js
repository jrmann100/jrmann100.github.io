const main = document.querySelector("main#layout");
let count = 0;

window.addEventListener("popstate", ev => {
    console.log(`[popstate] ${window.location.pathname}`);
    load(window.location.pathname);
});

async function load(path) {
    document.querySelector("#count").textContent = count++;

    const req = await fetch(path.replace(".html", ".html.inc"));
    const body = await req.text();
    const fragment = new DOMParser().parseFromString(body, 'text/html');

    main.innerHTML = "";

    dynamify(fragment.body);
    main.append(...fragment.body.children);

    document.head.querySelectorAll("[data-is-fragment=yes]").forEach(el => el.remove());
    fragment.head.querySelectorAll("*").forEach(el => el.dataset["isFragment"] = "yes");
    document.head.append(...fragment.head.children);

}

function dynamify(parent) {
    parent.querySelectorAll("a").forEach(el => {
        el.addEventListener("click", async ev => {
            ev.preventDefault();
            const path = new URL(el.href).pathname;
            if (window.location.pathname !== path) {
                console.log(window.location.pathname, "->", path);
                load(path);
                window.history.pushState(null, null, el.href);
            } else {
                console.log(window.location.pathname, "x", path);
            }
        })
    })
}

dynamify(document.body);