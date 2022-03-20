import { setup as setupRouting } from "./routing.js";
import { setup as setupMedia } from "./media.js";

setupRouting();
setupMedia();
console.log("all modules loaded.");
document.body.addEventListener("navigate", () => {
    console.log('navigating');
    document.querySelector('header .eye path').animate(
        {
            transform: ['rotateZ(90deg) scaleY(-1)', 'rotateZ(450deg) scaleY(-1)'],
            strokeDasharray: ['343, 343, 343', '0, 343, 343'],
            strokeDashoffset: [0, 340]
        },
        2000);
});