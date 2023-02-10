/**
 * @file Animates the face logo in the header.
 * @author Jordan Mann
 */

/**
 * A spin animation to indicate dynamic page loading.
 */
const loadingAnimation = document.querySelector('header .eye path')?.animate(
  {
    transform: ['rotateZ(90deg) scaleY(-1)', 'rotateZ(450deg) scaleY(-1)'],
    strokeDasharray: ['343, 343, 343', '0, 343, 343'],
    strokeDashoffset: [0, 340]
  },
  {
    duration: 1500,
    easing: 'ease-in'
  }
);

// Don't play the loading animation on first load.
loadingAnimation?.finish();

const motionQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');

// Play the loading animation on dynamic page load - this event is fired by the routing module.
document.layoutAddEventListener('navigate', () => {
  if (motionQuery.matches) {
    loadingAnimation?.play();
  }
});

if (window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
  // only follow the cursor when the cursor can hover over things
  document.documentElement.layoutAddEventListener('mousemove', (evt) => {
    if (!(evt instanceof MouseEvent)) {
      // fixme it's a bug with layoutAddEventListener
      return;
    }
    const els = document.querySelectorAll('header .face svg');
    const face_rect = els[0].getBoundingClientRect();

    /**
     * Constrain x within the range (1, -1),
     * so that there isn't an overly dramatic effect
     * when the cursor is at the bottom of the page.
     *
     * It helps to just plot 2/pi * arctan(2x)
     * if you wnat to see how this math works.
     *
     * @param {number} x some value to limit.
     * @returns {number} the constrained value.
     */
    const cap = (x) => (2 / Math.PI) * Math.atan(2 * x);
    const chx = cap((evt.clientX - (face_rect.x + face_rect.width / 2)) / face_rect.width);
    const chy = cap((evt.clientY - (face_rect.y + face_rect.height / 2)) / face_rect.height);

    window.requestAnimationFrame(() =>
      els.forEach((el, n) => {
        if (!(el instanceof SVGElement)) {
          return;
        }
        el.style.transform = `perspective(100rem) rotateY(${
          (chx * 20 * (n + 1)) / els.length
        }deg) rotateX(${(chy * -20 * (n + 1)) / els.length}deg) translateZ(${
          n * el.getBoundingClientRect().width * 0.08
        }px)`;
        // Changed to white for some wacky box-shadow stuff. Was rgba(0,0,0,0.2).
        el.style.filter = `drop-shadow(${chx * 0.5}rem ${
          Math.abs(chy) * 0.5
        }rem 0.5rem var(--shadow-color))`;
      })
    );
  });
}
