// function updateLayout(query) {
//     document.body.classList.toggle("mobile", query.matches);
//     document.body.classList.toggle("desktop", !query.matches);
// }

// const query = window.matchMedia('screen and (max-aspect-ratio: 3/4)');
// query.addEventListener('change', updateLayout);
// updateLayout(query);

export const mobile = window.matchMedia('(max-aspect-ratio: 3/4)');
export const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');