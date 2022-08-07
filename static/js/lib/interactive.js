/**
 * @file Helper module for interactive UI components.
 * @author Jordan Mann
 */

// https://stackoverflow.com/a/13080306/9068081
document.body.layoutAddEventListener('touchstart', () => undefined, { passive: true });
