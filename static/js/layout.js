import './routing.js';
import './face.js';
import { motion } from './media.js';

const loadingAnimation = document.querySelector('header .eye path')?.animate(
  {
    transform: ['rotateZ(90deg) scaleY(-1)', 'rotateZ(450deg) scaleY(-1)'],
    strokeDasharray: ['343, 343, 343', '0, 343, 343'],
    strokeDashoffset: [0, 340]
  },
  1500
);
if (loadingAnimation !== undefined) {
  loadingAnimation.finish();
  console.log('all modules loaded.');
  document.documentElement.addEventListener('navigate', () => {
    console.log('navigating');
    if (motion.matches) {
      loadingAnimation.play();
    }
  });
}
