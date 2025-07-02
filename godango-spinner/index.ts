const machine = document.querySelector<HTMLDivElement>(".machine");
if (machine === null) {
  throw new Error("Machine element not found");
}

const reels = [...machine.querySelectorAll<HTMLDivElement>(".reel")].map(
  (reel) => {
    const [a, b] = reel.querySelectorAll<HTMLElement>(".face");
    return [a, b];
  }
);

const controller = machine.querySelector<HTMLDivElement>(".controller");
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
// contains the timestamp a click started, and the next reel to be boosted.
const clicks: [number, number][] = [];

const between: {
  (
    progress: number,
    firstStop: number,
    secondStop: number,
    thirdStop: number
  ): number;
  (progress: number, start: number, end: number): number;
} = (
  progress: number,
  firstStop: number,
  secondStop: number,
  thirdStop?: number
) => {
  if (thirdStop === undefined) {
    return firstStop + (secondStop - firstStop) * progress;
  } else if (progress < 0.5) {
    return firstStop + (secondStop - firstStop) * (progress * 2);
  }
  return secondStop + (thirdStop - secondStop) * ((progress - 0.5) * 2);
};

const addVelocity = (reelIndex: number, delta: number) => {
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

const scaleVelocity = (reelIndex: number, factor: number) => {
  velocities[reelIndex] *= factor;
};

const setVelocity = (reelIndex: number, newVelocity: number) => {
  if (velocities[reelIndex] === 0 && newVelocity !== 0) {
    movingReels++;
  } else if (velocities[reelIndex] !== 0 && newVelocity === 0) {
    movingReels--;
  }
  velocities[reelIndex] = newVelocity;
};

const renderFace = (face: HTMLElement, progress: number, a = false) => {
  const p = (progress + (a ? 0 : 0.5)) % 1;
  face.style.transform = `translateY(${
    between(p, -100, 0, 100) - Number(!a) * 100
  }%) rotateX(${between(p, 50, -50)}deg)`;
  face.style.transformOrigin = `${between(p, 100, 0)}% 50%`;
  face.style.opacity = `${between(p, 0, 1, 0)}`;
};

// todo: call with "force" to update the first time
const updatePosition = (i: number, newPosition: number) => {
  const [a, b] = reels[i];
  if (i !== 0) {
    if (newPosition > 1) {
      a.textContent = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    } else if (positions[i] < 0.5 && newPosition >= 0.5) {
      b.textContent = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
  }
  positions[i] = newPosition % 1;
  renderFace(a, positions[i], true);
  renderFace(b, positions[i], false);
};

const tick = (timestamp: number) => {
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
      setVelocity(i, 0);
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
        setVelocity(i, 0);
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
  clicks.push([performance.now(), 0]);
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

// quickly init the reels
startTicking();

// TODO: add touch support.
