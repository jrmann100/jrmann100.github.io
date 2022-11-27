/**
 * @file Helper module for interactive UI components.
 * @author Jordan Mann
 */

// https://stackoverflow.com/a/13080306/9068081
document.body.layoutAddEventListener('touchstart', () => undefined, { passive: true });

document.querySelectorAll('.fake-summary').forEach((el) => {
  el.layoutAddEventListener('mousedown', (ev) => {
    ev.preventDefault();
    if (el.parentElement?.matches(':focus-within')) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    } else {
      el.parentElement?.focus();
    }
  });
});
