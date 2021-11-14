const main = document.querySelector("main#layout");
let count = 0;

window.addEventListener("popstate", ev => {
    console.log(`[popstate] ${window.location.pathname}`);
    load(window.location.pathname);
});


const animations = {
    swing: {
        in: [{
            transform: 'translate(80vw, -1rem)',
            opacity: '0'
        },
        {
            transform: 'translate(0vw, 0rem)',
            opacity: '1'
        }], out: [{
            transform: 'translate(0vw, 0rem)',
            opacity: '1'
        }, {
            transform: 'translate(-80vw, 1rem)',
            opacity: '0'
        }]
    },
    // fade: {
    //     in: [{
    //         opacity: '0'
    //     },
    //     {
    //         opacity: '1'
    //     }], out: [{
    //         opacity: '1'
    //     }, {
    //         opacity: '0'
    //     }]
    // },
    spin: {
        in: [{
            transform: 'rotate(0) scale(0)',
        },
        {
            transform: 'rotate(360deg) scale(1)',
        }], out: [{
            transform: 'rotate(0) scale(1)',
            opacity: '1'
        }, {
            transform: 'rotate(360deg) scale(0)',
        }]
    },
    flip: {
        in: [{
            transform: 'rotateY(-90deg)',
        },
        {
            transform: 'rotateY(0deg)',
        }], out: [{
            transform: 'rotateY(0deg)',
            opacity: '1'
        }, {
            transform: 'rotateY(90deg)',
        }]
    },
}

async function load(path) {
    const emoji = ["😶", "😮", "🥱", "🤭", "😶", "😯", "😮‍💨", "😴", "😴", "🥱", "😳", "😊", "🤗"];
    document.querySelector("#emoji").textContent = emoji[count++ % emoji.length];

    const req = await fetch(path.replace(".html", ".html.inc"));
    const body = await req.text();


    const animation = Object.values(animations)[Math.floor(Math.random() * Object.keys(animations).length)];

    setTimeout(() => {
        main.innerHTML = "";
        main.appendChild(dynamify(document.createRange().createContextualFragment(body)));
        main.animate(
            animation.in, {
            duration: 500,
            fill: 'forwards',
            easing: 'ease-out'
        }
        )
    }, main.animate(
        animation.out, {
        duration: 500,
        fill: 'forwards',
        easing: 'ease-in'
    }
    ).effect.getComputedTiming().duration);
}

function dynamify(parent) {
    parent.querySelectorAll("a").forEach(el => {
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

dynamify(document.body);