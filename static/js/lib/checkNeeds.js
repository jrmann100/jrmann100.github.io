const checkNeeds = () => {
  // enable components which require javascript.
  document.querySelectorAll('[data-needs-js]').forEach((el) => el.removeAttribute('hidden'));

  // enable components which require a secure context.
  if (window.isSecureContext) {
    document.querySelectorAll('[data-needs-secure]').forEach((el) => el.removeAttribute('hidden'));
  }
};

export default checkNeeds;
