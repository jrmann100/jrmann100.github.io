const a = document.querySelector<HTMLDivElement>(".reel .face:nth-child(1)");
const b = document.querySelector<HTMLDivElement>(".reel .face:nth-child(2)");
if (a === null || b === null) {
  throw new Error("Elements not found");
}

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

let velocity = 0;
let progress = 0;
let lastTimestamp = 0;
const tick = (timestamp: number) => {
  progress = (progress + (timestamp - lastTimestamp) * velocity) % 1;
  lastTimestamp = timestamp;

  // if velocity is low or negative, bring it towards 0.
  if (velocity < 1e-4) {
    velocity = 0;
  }

  velocity *= 0.9;

  const snaps = [0, 0.5, 1];
  const nearestSnap = snaps.reduce((prev, curr) =>
    Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev
  );
  // the spring can only engage if the velocity is low enough;
  // otherwise it glides across the peaks.
  if (velocity < 0.002) {
    velocity += (nearestSnap - progress) * 0.008;
  }

  if (Math.abs(velocity) < 1e-5) {
    velocity = 0;
    progress = nearestSnap;
  }
  console.log(velocity, progress);

  update(a, progress, true);
  update(b, progress, false);

  requestAnimationFrame(tick);
};

document.body.addEventListener("click", () => {
  velocity += 0.005;
});

// TODO: add touch/scroll support.
// probably we will want a "control wheel" that accepts all of these events
// and just says "spin" or the like

requestAnimationFrame(tick);
