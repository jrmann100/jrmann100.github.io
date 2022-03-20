function updateLayout(query) {
    document.body.classList.toggle("mobile", query.matches);
    document.body.classList.toggle("desktop", !query.matches);
}

export function setup() {
    const query = window.matchMedia('screen and (max-aspect-ratio: 3/4)');
    query.addEventListener('change', updateLayout);
    updateLayout(query);
}