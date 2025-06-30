const reels = [...document.querySelectorAll<HTMLDivElement>(".reel")].map(
  (reel) => [
    reel.querySelector<HTMLDivElement>(".face:nth-child(1)"),
    reel.querySelector<HTMLDivElement>(".face:nth-child(2)"),
  ]
);

const betweenFactory =
  (progress: number) =>
  (...stops: number[]) => {
    const position = progress * (stops.length - 1);
    const lowerValue = stops[Math.floor(position)];
    const upperValue = stops[Math.ceil(position)];
    return lowerValue + (upperValue - lowerValue) * (position % 1);
  };

const update = (element: HTMLElement, progress: number, a = false) => {
  const between = betweenFactory((progress + Number(a) * 0.5) % 1);
  element.style.transform = `translateY(${
    between(-100, 0, 100) - Number(!a) * 100
  }%) rotateX(${between(50, -50)}deg)`;
  element.style.transformOrigin = `${between(100, 0)}% 50%`;
  element.style.opacity = `${between(0, 1, 0)}`;
};

const velocities = reels.map(() => 0);
const progresses = reels.map(() => 0);
let lastTimestamp = 0;
const tick = (timestamp: number) => {
  reels.forEach(([a, b], i) => {
    progresses[i] =
      (progresses[i] + (timestamp - lastTimestamp) * velocities[i]) % 1;

    if (velocities[i] < 1e-4) {
      // if velocity is low or negative, bring it back to zero.
      // checkme: there is probably a more elegant way to do this!
      // like having the spring apply a weaker backwards force in the first place.
      velocities[i] = 0;
    } else {
      // apply friction
      velocities[i] *= 0.9; // + 0.04 * (i / reels.length);
    }

    const snaps = [0, 0.5, 1];
    const nearestSnap = snaps.reduce((prev, curr) =>
      Math.abs(curr - progresses[i]) < Math.abs(prev - progresses[i])
        ? curr
        : prev
    );
    // the spring can only engage if the velocity is low enough;
    // otherwise it glides across the peaks.
    if (velocities[i] < 0.002) {
      velocities[i] += (nearestSnap - progresses[i]) * 0.008;
    }

    if (Math.abs(velocities[i]) < 1e-5) {
      velocities[i] = 0;
      progresses[i] = nearestSnap;
    }

    if (a === null || b === null) {
      throw new Error("Reel faces not found");
    }
    update(a, progresses[i], true);
    update(b, progresses[i], false);
  });

  lastTimestamp = timestamp;
  requestAnimationFrame(tick);
};

document.body.addEventListener("click", () => {
  // v += 0.005;
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
