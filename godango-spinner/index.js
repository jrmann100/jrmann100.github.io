const machine = document.querySelector(".machine");
if (machine === null) {
  throw new Error("Machine element not found");
}

const reels = [...machine.querySelectorAll(".reel")].map((reel) => {
  const [a, b] = reel.querySelectorAll(".face");
  return [a, b];
});

const controller = machine.querySelector(".controller");
if (controller === null) {
  throw new Error("Controller element not found");
}

const reelCount = reels.length;
const velocities = new Array(reelCount).fill(0);
const positions = new Array(reelCount).fill(0);
let movingReels = 0;
let lastWheelTime = -Infinity;
let lastTickTime = -Infinity;
let isTicking = false;

/**
 * Array of tuples containing the time the last reel was boosted and the index of the next reel to boost.
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

// TODO: a and b are swapped in these functions!
/**
 * Update the position of a reel face.
 * @param {HTMLElement} face the element to update.
 * @param {number} position the position value between 0 and 1.
 * @param {boolean} [a=false] whether this is the first or the second face of the reel.
 */
const renderFace = (face, position, a = false) => {
  // the position of the second face is offset by 0.5
  const p = Math.abs((position + (a ? 0.5 : 0)) % 1);
  face.style.transform = `translateY(${
    // go from all the way above the reel to all the way below it
    between(p, -100, 0, 100) - Number(!a) * 100
  }%) rotateX(${between(p, 50, -50)}deg)`;
  face.style.transformOrigin = `${between(p, 100, 0)}% 50%`;
  face.style.opacity = `${between(p, 0, 1, 0)}`;
};

/**
 * Update the position of a reel.
 * @param {number} i the index of the reel to update.
 * @param {number} newPosition the new position of the reel, between 0 and 1.
 */
// todo: call with "force" to update the first time
const updatePosition = (i, newPosition) => {
  const [a, b] = reels[i];
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
 *
 * @param {number} timestamp
 */
const tick = (timestamp) => {
  if (!isTicking) return;

  const timeDelta = (timestamp - lastTickTime) / 1000;
  const timeFactor = timeDelta * 60;
  const frictionFactor = Math.pow(0.9, timeFactor);

  for (let i = 0; i < clicks.length; i++) {
    // immediately start the control reel and the first reel.
    if (clicks[i][1] === 0) {
      addVelocity(clicks[i][1]++, 5);
      addVelocity(clicks[i][1]++, 5);
      clicks[i][0] = timestamp;
    } else {
      // todo: replace all magic numbers
      if (timestamp - clicks[i][0] > 50) {
        clicks[i][0] = timestamp;
        addVelocity(clicks[i][1]++, 5);
      }
    }
    if (clicks[i][1] >= reelCount) {
      clicks.shift();
      i--;
    }
  }

  reels.forEach((_, i) => {
    if (velocities[i] < 0) {
      // if velocity is negative, bring it back to zero.
      // checkme: there is probably a more elegant way to do this!
      // like having the spring apply a weaker backwards force in the first place.
      clearVelocity(i);
    } else {
      // apply friction
      scaleVelocity(i, frictionFactor);
    }

    if (timestamp - lastWheelTime > (i === 0 ? 1 : i) * 50) {
      const nearestSnap = Math.round(positions[i] * 2) / 2;
      // the spring can only engage if the velocity is low enough;
      // otherwise it glides across the peaks.
      if (velocities[i] < 2) {
        addVelocity(i, (nearestSnap - positions[i]) * 8 * timeFactor);
      }

      if (Math.abs(velocities[i]) < 1e-2) {
        clearVelocity(i);
        positions[i] = nearestSnap;
      }
    }

    const newPosition = positions[i] + timeDelta * velocities[i];
    updatePosition(i, newPosition);
  });

  lastTickTime = timestamp;

  // If all reels have stopped moving and none are held, stop the loop.
  if (movingReels === 0 && timestamp - lastWheelTime > reelCount * 50) {
    isTicking = false;
  } else {
    requestAnimationFrame(tick);
  }
};

const startTicking = () => {
  if (!isTicking) {
    isTicking = true;
    // Reset timestamp to avoid a large jump after a pause
    lastTickTime = performance.now();
    requestAnimationFrame(tick);
  }
};

controller.addEventListener("click", () => {
  clicks.push([-Infinity, 0]);
  startTicking();
});

controller.addEventListener("wheel", (event) => {
  event.preventDefault();
  if (event.deltaY >= 0) {
    return;
  }
  if (!isTicking) {
    startTicking();
  }
  lastWheelTime = performance.now();
  for (let i = 0; i < reelCount; i++) {
    updatePosition(i, Math.max(positions[i] - event.deltaY / 1000, 0));
  }
});

// quickly init the reels - should just loop once and then terminate since there is no motion.
startTicking();

// TODO: add touch support.
