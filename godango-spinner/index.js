/**
 * Container element for the reels.
 */
const machine = document.querySelector(".machine");
if (machine === null) {
  throw new Error("Machine element not found");
}

/**
 * The reels of the machine.
 */
const reels = [...machine.querySelectorAll(".reel")];

/**
 * The controller reel is the first reel.
 *
 * It has a static label and handles user input.
 */
const controller = reels[0];

/**
 * The faces of the machine, grouped in pairs by reel.
 */
const faces = reels.map((reel) => {
  const faces = [...reel.querySelectorAll(".face")];
  if (faces.length !== 2) {
    throw new Error("Each reel must have exactly two faces");
  }
  const [a, b] = faces;
  return [a, b];
});

/**
 * The total number of reels, including the controller.
 */
const reelCount = faces.length;

/**
 * The velocity of each reel.
 * @type {number[]}
 */
const velocities = new Array(reelCount).fill(0);

/**
 * The position of each reel, between 0 and 1.
 * The faces swap positions such that there is always at least one face visible,
 * and another face entering from the top.
 *
 * | Position | First Face | Second Face |
 * |----------|------------|-------------|
 * | 0        | Center     | Above       |
 * | 0.49     | Below      | Entering    |
 * | 0.5      | Top        | Center      |
 * | 0.99     | Entering   | Below       |
 */
const positions = new Array(reelCount).fill(0);

/**
 * The number of reels currently moving.
 * The same as counting nonzero velocities.
 */
let movingReels = 0;

const NEVER = -Infinity;

/**
 * The time the last wheel event was triggered, or -Infinity if no wheel event has occurred.
 */
let lastWheelTime = NEVER;

/**
 * The time the last animation frame was processed, or -Infinity if no frames have been processed.
 */
let lastFrameTime = NEVER;

/**
 * Whether the animation loop is currently running.
 */
let animationRunning = false;

/**
 * Queue of tuples containing the time the last reel was boosted and the index of the next reel to boost.
 * @type {[number, number][]}
 */
const clicks = [];

/**
 * @overload
 * Calculates a value between two stops based on position.
 * @param {number} position the position value between 0 and 1.
 * @param {number} start the first stop value.
 * @param {number} end the second stop value.
 */

/**
 * @overload
 * Calculates a value between three stops based on position.
 * @param {number} position the position value between 0 and 1.
 * @param {number} firstStop the first stop value.
 * @param {number} secondStop the second stop value.
 * @param {number} thirdStop the optional third stop value.
 */

/**
 * @param {number} position the position value between 0 and 1.
 * @param {number} firstStop the first stop value.
 * @param {number} secondStop the second stop value.
 * @param {number} [thirdStop] the optional third stop value.
 * @returns {number} the calculated value between the stops.
 */
const between = (position, firstStop, secondStop, thirdStop) => {
  if (thirdStop === undefined) {
    return firstStop + (secondStop - firstStop) * position;
  } else if (position < 0.5) {
    return firstStop + (secondStop - firstStop) * (position * 2);
  }
  return secondStop + (thirdStop - secondStop) * ((position - 0.5) * 2);
};

/**
 * Add velocity to a reel.
 * Updates {@link movingReels} if the reel transitions between moving and stopped.
 * @param {number} reelIndex the index of the reel to add velocity to.
 * @param {number} delta the amount of velocity to add.
 */
const addVelocity = (reelIndex, delta) => {
  if (delta === 0) return;

  if (velocities[reelIndex] === 0) {
    velocities[reelIndex] = delta;
    movingReels++;
    return;
  }

  if ((velocities[reelIndex] += delta) === 0) {
    movingReels--;
  }
};

/**
 * Scale the velocity of a reel by a factor.
 * Updates {@link movingReels} if this stops the reel.
 * @param {number} reelIndex the index of the reel to scale.
 * @param {number} factor the factor to scale the velocity by.
 */
const scaleVelocity = (reelIndex, factor) => {
  if (factor === 0 && velocities[reelIndex] !== 0) {
    movingReels--;
  }
  velocities[reelIndex] *= factor;
};

/**
 * Set the velocity of a reel to a specific value.
 * Decrements {@link movingReels} if the reel was previously moving.
 * @param {*} reelIndex
 */
const clearVelocity = (reelIndex) => {
  if (velocities[reelIndex] !== 0) {
    velocities[reelIndex] = 0;
    movingReels--;
  }
};

const MAX_TILT = 50;

/**
 * Update the position of a reel face.
 * @param {HTMLElement} face the element to update.
 * @param {number} position the position value between 0 and 1.
 * @param {boolean} [a=false] whether this is the first or the second face of the reel.
 */
const renderFace = (face, position, a = false) => {
  // the position of the second face is offset by 0.5
  // occasionally the position will be negative; then we should add 1, mod, then abs.
  const p = Math.abs((position + 1 + (a ? 0.5 : 0)) % 1);
  face.style.transform = `translateY(${
    // go from all the way above the reel to all the way below it
    between(p, -100, 0, 100) - Number(!a) * 100
  }%) rotateX(${between(p, MAX_TILT, -MAX_TILT)}deg)`;
  // when a face is entering, its bottom edge should be at the top;
  // when it is exiting, its top edge should be at the bottom.
  face.style.transformOrigin = `${between(p, 100, 0)}% 50%`;
  face.style.opacity = `${between(p, 0, 1, 0)}`;
};

/**
 * Update the position of a reel.
 * @param {number} i the index of the reel to update.
 * @param {number} newPosition the new position of the reel, between 0 and 1.
 */
const updatePosition = (i, newPosition) => {
  const [a, b] = faces[i];
  if (i !== 0) {
    if (newPosition > 1) {
      b.textContent = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    } else if (positions[i] < 0.5 && newPosition >= 0.5) {
      a.textContent = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
  }
  positions[i] = newPosition % 1;
  renderFace(a, positions[i], true);
  renderFace(b, positions[i], false);
};

/**
 * Delay between boosting each reel after a click.
 */
const CLICK_START_OFFSET = 50;

/**
 * Delay between re-engaging the spring on each reel after manual scrolling.
 */
const WHEEL_END_OFFSET = 50;

/**
 * The baseline factor by which the velocity of a reel is reduced every 1/60th of a second.
 */
const FRICTION_FACTOR = 0.9;

/**
 * The factor by which the velocity of a reel is reduced when it is moving backward.
 */
const RESIST_FACTOR = 0.4;

/**
 * The amount of velocity added to a reel when it is boosted.
 */
const BOOST_AMOUNT = 5;

/**
 * The force with which the spring pulls the reel towards the nearest stop.
 */
const SPRING_FACTOR = 8;

/**
 * The velocity at which the wheel is moving too fast for the spring to engage.
 */
const SPRING_THRESHOLD = 2;

/**
 * Maximum time delta for a single animation frame, in seconds.
 */
const MAX_FRAME_TIME = 0.1;

/**
 * Update the state of the machine until all reels have stabilized.
 *
 * @type {FrameRequestCallback}
 */
const handleAnimationFrame = (timestamp) => {
  if (!animationRunning) return;

  // limit the time delta to avoid large jumps;
  // e.g., if the page was momentarily inactive.
  const timeDelta = Math.min(
    (timestamp - lastFrameTime) / 1000,
    MAX_FRAME_TIME
  );
  // this means timeFactor is 1 if running at 60 FPS, or 2 if running at 30 FPS.
  const timeFactor = timeDelta * 60;
  const frictionFactor = Math.pow(FRICTION_FACTOR, timeFactor);

  for (let i = 0; i < clicks.length; i++) {
    // immediately boost the control reel and the first reel.
    if (clicks[i][1] === 0) {
      addVelocity(clicks[i][1]++, BOOST_AMOUNT);
      addVelocity(clicks[i][1]++, BOOST_AMOUNT);
      clicks[i][0] = timestamp;
    }
    // for every following reel, wait START_OFFSET ms after the last reel was boosted.
    else if (timestamp - clicks[i][0] > CLICK_START_OFFSET) {
      clicks[i][0] = timestamp;
      addVelocity(clicks[i][1]++, BOOST_AMOUNT);
    }
    // remove this entry if there are no more reels to boost.
    // clicks is a queue and all clicks take the same amount of time to process,
    // so the entry to remove is always the first one.
    if (clicks[i][1] >= reelCount) {
      clicks.shift();
      i--;
    }
  }

  faces.forEach((_, i) => {
    // apply friction, and resist backward motion.
    scaleVelocity(i, frictionFactor * (velocities[i] < 0 ? RESIST_FACTOR : 1));

    // manual movement (scrolling) overrides the spring.
    // once there has been END_OFFSET ms of no manual movement,
    // the springs start to engage one at a time every END_OFFSET ms,
    // except for the controller (0th) reel, which engages at the same time as the first reel.
    if (timestamp - lastWheelTime > (i === 0 ? 1 : i) * WHEEL_END_OFFSET) {
      // round to nearest 0.5
      const nearestSnap = Math.round(positions[i] * 2) / 2;
      // the spring can only engage if the velocity is low enough;
      // otherwise it glides across the peaks.
      if (velocities[i] < SPRING_THRESHOLD) {
        addVelocity(
          i,
          (nearestSnap - positions[i]) * FRICTION_FACTOR * timeFactor
        );
      }
    }

    updatePosition(i, positions[i] + timeDelta * velocities[i]);
  });

  lastFrameTime = timestamp;

  // if all reels have stopped moving and none are held, pause the animation loop.
  if (
    movingReels === 0 &&
    timestamp - lastWheelTime > reelCount * WHEEL_END_OFFSET
  ) {
    animationRunning = false;
  } else {
    requestAnimationFrame(handleAnimationFrame);
  }
};

/**
 * Re-start the animation loop if it was paused.
 */
const resumeAnimation = () => {
  if (!animationRunning) {
    animationRunning = true;
    // reset timestamp to avoid a large jump after a pause
    lastFrameTime = performance.now();
    requestAnimationFrame(handleAnimationFrame);
  }
};

controller.addEventListener("click", () => {
  clicks.push([NEVER, 0]);
  resumeAnimation();
});

// TODO: add touch support.
controller.addEventListener("wheel", (event) => {
  event.preventDefault();
  if (event.deltaY >= 0) {
    return;
  }
  // safe to call every time, there's an embedded check to prevent multiple RAF calls.
  resumeAnimation();
  lastWheelTime = performance.now();
  // manually scroll the reels.
  for (let i = 0; i < reelCount; i++) {
    updatePosition(i, Math.max(positions[i] - event.deltaY / 1000, 0));
  }
});

// quickly init the reels - should just loop once and then terminate since there is no motion.
resumeAnimation();
