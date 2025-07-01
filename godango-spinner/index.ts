const machine = document.querySelector<HTMLDivElement>(".machine");
if (machine === null) {
  throw new Error("Machine element not found");
}

const reels = [...machine.querySelectorAll<HTMLDivElement>(".reel")].map(
  (reel) => {
    const a = reel.querySelector<HTMLDivElement>(".face:nth-child(1)");
    const b = reel.querySelector<HTMLDivElement>(".face:nth-child(2)");
    if (a === null || b === null) {
      throw new Error("Reel faces not found");
    }
    return [a, b];
  }
);

const controller = machine.querySelector<HTMLDivElement>(".controller");
if (controller === null) {
  throw new Error("Controller element not found");
}

const between = (progress: number, ...stops: number[]) => {
  const position = progress * (stops.length - 1);
  const lowerValue = stops[Math.floor(position)];
  const upperValue = stops[Math.ceil(position)];
  return lowerValue + (upperValue - lowerValue) * (position % 1);
};

const update = (face: HTMLElement, progress: number, a = false) => {
  const p = (progress + (a ? 0 : 0.5)) % 1;
  face.style.transform = `translateY(${
    between(p, -100, 0, 100) - Number(!a) * 100
  }%) rotateX(${between(p, 50, -50)}deg)`;
  face.style.transformOrigin = `${between(p, 100, 0)}% 50%`;
  face.style.opacity = `${between(p, 0, 1, 0)}`;
};

const velocities = new Array(reels.length).fill(0);
const positions = new Array(reels.length).fill(0);
const held = new Array(reels.length).fill(false);

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
  update(a, positions[i], true);
  update(b, positions[i], false);
};

let lastTimestamp = 0;
let isTicking = false;

const tick = (timestamp: number) => {
  if (!isTicking) return;

  const timeDelta = (timestamp - lastTimestamp) / 1000;
  const timeFactor = timeDelta * 60;
  const frictionFactor = Math.pow(0.9, timeFactor);
  reels.forEach(([a, b], i) => {
    if (velocities[i] < 0) {
      // if velocity is negative, bring it back to zero.
      // checkme: there is probably a more elegant way to do this!
      // like having the spring apply a weaker backwards force in the first place.
      velocities[i] = 0;
    } else {
      // apply friction
      velocities[i] *= frictionFactor;
    }

    if (!held[i]) {
      const nearestSnap = Math.round(positions[i] * 2) / 2;
      // the spring can only engage if the velocity is low enough;
      // otherwise it glides across the peaks.
      if (velocities[i] < 2) {
        velocities[i] += (nearestSnap - positions[i]) * 8 * timeFactor;
      }

      if (Math.abs(velocities[i]) < 1e-2) {
        velocities[i] = 0;
        positions[i] = nearestSnap;
      }
    }

    const newPosition = positions[i] + timeDelta * velocities[i];
    updatePosition(i, newPosition);
  });

  lastTimestamp = timestamp;

  // If all reels have stopped moving and none are held, stop the loop.
  if (velocities.every((v) => v === 0) && !held.some((h) => h)) {
    isTicking = false;
  } else {
    requestAnimationFrame(tick);
  }
};

const startTicking = () => {
  if (!isTicking) {
    isTicking = true;
    // Reset timestamp to avoid a large jump after a pause
    lastTimestamp = performance.now();
    requestAnimationFrame(tick);
  }
};

controller.addEventListener("click", () => {
  for (let i = 0; i < reels.length; i++) {
    // todo: this means that copying the result will need to await all velocities === 0
    setTimeout(() => {
      velocities[i] += 5;
      startTicking();
    }, (i === 0 ? i : i - 1) * 50);
  }
});

let scrollTimeout: number | undefined = undefined;
let totalScroll = 0;
controller.addEventListener("wheel", (event) => {
  event.preventDefault();
  if (event.deltaY >= 0) {
    return;
  }
  // checkme: is this costly?
  held.fill(true);
  totalScroll -= event.deltaY * 4;
  for (let i = 0; i < reels.length; i++) {
    if (totalScroll < i * 50) {
      continue;
    }
    updatePosition(i, Math.max(positions[i] - event.deltaY / 1000, 0));
  }
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    for (let i = 0; i < reels.length; i++) {
      // checkme: do we need to clear these timeouts if we start scrolling again?
      // or should we assume it just gets overwritten?
      setTimeout(() => {
        startTicking();
        held[i] = false;
      }, i * 50);
    }
    totalScroll = 0;
  }, 50);
});

// TODO: add touch support.
