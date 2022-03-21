<!--{{head}}-->
<title>Welcome to Jordan's Website</title>
<meta name="description" content="Jordan made a little routing website and wants you to check it out!">
<style>
    header div.face {
        height: 10rem;
        width: 10rem;
        margin: 1rem;
    }

    header>nav>ul>li.index {
        font-weight: bold;
    }


    body.stuck header .title div.lower {
        text-transform: lowercase;
    }

    header .title div {
        --title-div-transition: max-width 0.3s, opacity 0.2s;
        transition: var(--title-div-transition), visibility 0.3s 0s;
        display: inline-block;
    }

    header .title div.name {
        display: flex;
        justify-content: center;
        width: 16rem;
        transition: width 0.3s;

    }

    body.stuck header div.name {
        width: 14rem;
    }

    header .title div.del {
        max-width: 8.5rem;
        opacity: 1;
        visibility: visible;
        transform-origin: right;
    }

    body.stuck header .title div.del {
        max-width: 0;
        visibility: hidden;
        opacity: 0;
        transition: var(--title-div-transition), visibility 0s 0.3s;
    }

    header .title div.undel {
        max-width: 0;
        visibility: hidden;
        opacity: 0;
        transition: var(--title-div-transition), visibility 0s 0.5s, opacity 0.1s;
        /* Check this whole transition thing for opacity. */
    }

    body.stuck header .title div.undel {
        opacity: 1;
        visibility: visible;
        transition: var(--title-div-transition), visibility 0.5s 0s;
    }

    body.stuck header .title div.undel {
        max-width: 2.5rem;
    }

    /* I absolutely hate this. :-of-type is dependent on tags, so we need to target 2/2 where it is a sibling of another one of its kind. */
    body.stuck header .title div.undel.h {
        max-width: 5rem;
    }
</style>
<!--{{/head}}-->
<!--{{title}}-->
&nbsp;Hi,&nbsp;I'm
<noscript>Jordan Mann.</noscript>
<div class="name" style="display: none;">
    <div class="lower">J</div>
    <div class="del">ordan&nbsp;</div>
    <div class="undel">r</div>
    <div class="del">M</div>
    <div class="undel">m</div>
    ann
    <div class="undel h">100</div>
    .
</div>
<!--{{/title}}-->
<!--{{main}}-->
<h1 class="title">
    Jordan's Website
</h1>
<p>
    Hello and welcome to my website!
</p>
<p>
    I hope to show you many interesting things here.
</p>
<p>
    But I have not made them yet. So for now please enjoy what is on the page and we will deal with the rest later!
</p>
<script>
    document.documentElement.addEventListener("mousemove", (e) => {
        const els = document.querySelectorAll("header .face svg");
        const face_rect = els[0].getBoundingClientRect();

        // The function approaches 1 and -1, so that there isn't a dramatic effect at the bottom of the page.

        const cap = (x) => 2 / Math.PI * Math.atan(2 * x);
        const chx = cap((e.clientX - (face_rect.x + (face_rect.width / 2))) / face_rect.width);
        const chy = cap((e.clientY - (face_rect.y + (face_rect.height / 2))) / face_rect.height);

        window.requestAnimationFrame(() =>
            els.forEach((el, n) => {
                el.style.transform = `perspective(100rem) rotateY(${chx * 20 * (n + 1) / els.length}deg) rotateX(${chy * -20 * (n + 1) / els.length}deg) translateZ(${n * 0.5}rem)`;
                // Changed to white for some wacky box-shadow stuff. Was rgba(0,0,0,0.2).
                el.style.filter = `drop-shadow(${chx * 0.5}rem ${Math.abs(chy) * 0.5}rem 0.5rem var(--shadow-color))`
            }))
    });

    new IntersectionObserver(
        ([e]) => {
            document.body.classList.toggle("stuck", !e.isIntersecting);
        }, {
        threshold: [0.9]
    }
    ).observe(document.querySelector('header'));
    document.querySelector("header .name").style.removeProperty('display'); // hidden by default if no JS.
</script>
<!--{{/main}}-->