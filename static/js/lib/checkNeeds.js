/**
 * Check properties of the page (whether JavaScript is enabled, a secure context, etc.)
 * and conditionally un-hide elements that require those properties by their `data-needs-*` attributes.
 */
const checkNeeds = () => {
  // enable components which require javascript.
  document.querySelectorAll('[data-needs-js]').forEach((el) => el.removeAttribute('hidden'));

  // enable components which require a secure context.
  if (window.isSecureContext) {
    document.querySelectorAll('[data-needs-secure]').forEach((el) => el.removeAttribute('hidden'));
  }
};

export default checkNeeds;
