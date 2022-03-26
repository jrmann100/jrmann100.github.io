if (window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) { // only follow the cursor when the cursor can hover over things
    document.documentElement.addEventListener("mousemove", (e) => {
        const els = document.querySelectorAll("header .face svg");
        const face_rect = els[0].getBoundingClientRect();

        // The function approaches 1 and -1, so that there isn't a dramatic effect at the bottom of the page.

        const cap = (x) => 2 / Math.PI * Math.atan(2 * x);
        const chx = cap((e.clientX - (face_rect.x + (face_rect.width / 2))) / face_rect.width);
        const chy = cap((e.clientY - (face_rect.y + (face_rect.height / 2))) / face_rect.height);

        window.requestAnimationFrame(() =>
            els.forEach((el, n) => {
                el.style.transform = `perspective(100rem) rotateY(${chx * 20 * (n + 1) / els.length}deg) rotateX(${chy * -20 * (n + 1) / els.length}deg) translateZ(${n * el.getBoundingClientRect().width * 0.08}px)`;
                // Changed to white for some wacky box-shadow stuff. Was rgba(0,0,0,0.2).
                el.style.filter = `drop-shadow(${chx * 0.5}rem ${Math.abs(chy) * 0.5}rem 0.5rem var(--shadow-color))`
            }))
    });
}