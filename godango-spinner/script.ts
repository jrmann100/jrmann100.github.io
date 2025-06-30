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
  // account for friction
  if (velocity < 1e-5) {
    velocity = 0; // Stop the animation if velocity is too low
  }
  velocity *= 0.9; // Apply friction
  const snaps = [0, 0.5, 1];
  const nearestSnap = snaps.reduce((prev, curr) =>
    Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev
  );
  // if (velocity < 0.001) {
  velocity += (nearestSnap - progress) * 0.01; // Adjust velocity towards the nearest snap point
  // }
  update(a, progress, true); // Offset the first element by 100% to avoid overlap
  update(b, progress, false); // Offset the second element by half a cycle
  requestAnimationFrame(tick);
};

document.body.addEventListener("click", (event) => {
  // Increase velocity on click
  velocity += 0.0085;
  // Prevent default action to avoid scrolling
  event.preventDefault();
});

requestAnimationFrame(tick);
