import createComponent from './components.js';

(async () => {
  await createComponent('switcher', {
    css: 'global',
    js: true
  });
  await createComponent('nosecure', {
    js: true
  });
  console.log('🧩 components module ready.');
})();
