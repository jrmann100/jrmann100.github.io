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

const velocities = reels.map(() => 0);
const positions = reels.map(() => 0);
let held = false;

let lastTimestamp = 0;
const tick = (timestamp: number) => {
  const timeDelta = (timestamp - lastTimestamp) / 1000;
  const timeFactor = timeDelta * 60;
  reels.forEach(([a, b], i) => {
    positions[i] = (positions[i] + timeDelta * velocities[i]) % 1;

    if (velocities[i] < 0) {
      // if velocity is negative, bring it back to zero.
      // checkme: there is probably a more elegant way to do this!
      // like having the spring apply a weaker backwards force in the first place.
      velocities[i] = 0;
    } else {
      // apply friction
      velocities[i] *= Math.pow(0.9, timeFactor);
    }

    if (!held) {
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

    update(a, positions[i], true);
    update(b, positions[i], false);
  });

  lastTimestamp = timestamp;
  requestAnimationFrame(tick);
};

controller.addEventListener("click", () => {
  for (let i = 0; i < reels.length; i++) {
    // todo: this means that copying the result will need to await all velocities === 0
    setTimeout(() => {
      velocities[i] += 5;
    }, (i === 0 ? i : i - 1) * 50);
  }
});

let scrollTimeout: number | undefined = undefined;
controller.addEventListener("wheel", (event) => {
  event.preventDefault();
  if (event.deltaY >= 0) {
    return;
  }
  held = true;
  for (let i = 0; i < reels.length; i++) {
    positions[i] = Math.max(positions[i] - event.deltaY / 1000, 0) % 1;
  }
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => (held = false), 50);
});

// TODO: add touch support.

requestAnimationFrame(tick);
