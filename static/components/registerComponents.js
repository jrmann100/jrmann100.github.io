import createComponent from './components.js';

(async () => {
  await createComponent('switcher', {
    css: 'global',
    js: true
  });
  await createComponent('nosecure', {
    js: true
  });
  await createComponent('tabs', {
    css: 'global',
    js: true
  });
  await createComponent('tabs/tab', {
    js: true
  });
  console.log('🧩 components module ready.');
})();
