import createComponent from './components.js';

// components are upgraded in the DOM as they are registered.
// this means you should register child components before their parents!
// otherwise, for instance, Tabs cannot know if its children are Tab components.
(async () => {
  await createComponent('switcher', {
    css: 'global',
    js: true
  });
  await createComponent('nosecure', {
    js: true
  });
  await createComponent('tabs/tab', {
    js: true,
    html: false
  });
  await createComponent('tabs', {
    css: 'global',
    js: true
  });
  console.log('🧩 components module ready.');
})();
