import { setup as setupRouting } from "./routing.js";
import { setPalette, setup as setupColors } from "./colors.js";
// import { setup as setupMedia } from "./media.js";

setupColors();
setupRouting();
// setupMedia();

const loadingAnimation = document.querySelector('header .eye path').animate(
    {
        transform: ['rotateZ(90deg) scaleY(-1)', 'rotateZ(450deg) scaleY(-1)'],
        strokeDasharray: ['343, 343, 343', '0, 343, 343'],
        strokeDashoffset: [0, 340]
    },
    1500);
loadingAnimation.finish();
console.log("all modules loaded.");
document.body.addEventListener("navigate", () => {
    console.log('navigating');
    loadingAnimation.play();
    setPalette();
});