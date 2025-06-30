const reels = [...document.querySelectorAll<HTMLDivElement>(".reel")].map(
  (reel) => {
    const a = reel.querySelector<HTMLDivElement>(".face:nth-child(1)");
    const b = reel.querySelector<HTMLDivElement>(".face:nth-child(2)");
    if (a === null || b === null) {
      throw new Error("Reel faces not found");
    }
    return [a, b];
  }
);

const between = (progress: number, ...stops: number[]) => {
  const position = progress * (stops.length - 1);
  const lowerValue = stops[Math.floor(position)];
  const upperValue = stops[Math.ceil(position)];
  return lowerValue + (upperValue - lowerValue) * (position % 1);
};

const update = (element: HTMLElement, progress: number, a = false) => {
  const p = (progress + (a ? 0 : 0.5)) % 1;
  element.style.transform = `translateY(${
    between(p, -100, 0, 100) - Number(!a) * 100
  }%) rotateX(${between(p, 50, -50)}deg)`;
  element.style.transformOrigin = `${between(p, 100, 0)}% 50%`;
  element.style.opacity = `${between(p, 0, 1, 0)}`;
};

const velocities = reels.map(() => 0);
const progresses = reels.map(() => 0);

let lastTimestamp = 0;
const tick = (timestamp: number) => {
  const timeDelta = timestamp - lastTimestamp;
  reels.forEach(([a, b], i) => {
    progresses[i] = (progresses[i] + timeDelta * velocities[i]) % 1;

    if (velocities[i] < 1e-4) {
      // if velocity is low or negative, bring it back to zero.
      // checkme: there is probably a more elegant way to do this!
      // like having the spring apply a weaker backwards force in the first place.
      velocities[i] = 0;
    } else {
      // apply friction
      velocities[i] *= 0.9;
    }

    const nearestSnap = Math.round(progresses[i] * 2) / 2;
    // the spring can only engage if the velocity is low enough;
    // otherwise it glides across the peaks.
    if (velocities[i] < 0.002) {
      velocities[i] += (nearestSnap - progresses[i]) * 0.008;
    }

    if (Math.abs(velocities[i]) < 1e-5) {
      velocities[i] = 0;
      progresses[i] = nearestSnap;
    }

    update(a, progresses[i], true);
    update(b, progresses[i], false);
  });

  lastTimestamp = timestamp;
  requestAnimationFrame(tick);
};

document.body.addEventListener("click", () => {
  for (let i = 0; i < reels.length; i++) {
    setTimeout(() => {
      velocities[i] += 0.005;
    }, i * 50);
  }
});

// TODO: add touch/scroll support.
// probably we will want a "control wheel" that accepts all of these events
// and just says "spin" or the like

requestAnimationFrame(tick);
