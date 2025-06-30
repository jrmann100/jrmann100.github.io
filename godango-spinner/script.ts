const a = document.querySelector<HTMLDivElement>(".reel .face:nth-child(1)");
const b = document.querySelector<HTMLDivElement>(".reel .face:nth-child(2)");
if (a === null || b === null) {
  throw new Error("Elements not found");
}

const betweenFactory =
  (progress: number) =>
  (...stops: number[]) => {
    const position = progress * (stops.length - 1);
    if (position % 1 === 0) {
      return stops[position];
    }
    const lowerIndex = Math.floor(position);
    const upperIndex = Math.ceil(position);
    const lowerValue = stops[lowerIndex];
    const upperValue = stops[upperIndex];
    return lowerValue + (upperValue - lowerValue) * (position % 1);
  };

const update = (element: HTMLElement, progress: number, a = false) => {
  const between = betweenFactory(progress);
  element.style.transform = `translateY(${
    between(-100, 0, 100) - Number(!a) * 100
  }%) rotateX(${between(50, -50)}deg)`;
  element.style.transformOrigin = `${between(100, 0)}% 50%`;
  element.style.opacity = `${between(0, 1, 0)}`;
};

const tick = (timestamp: number) => {
  // todo: apply blur if velocity is too high
  const rawProgress = (timestamp % 10000) / 10000;
  const easing = (t, slowness = 0.8) => {
    // Ensure t is within the 0-1 range
    if (t <= 0) {
      return 0;
    }
    if (t >= 1) {
      return 1;
    }

    const amplitude = slowness / (4 * Math.PI);
    return t - amplitude * Math.sin(4 * Math.PI * t);
  };
  const progress = easing(rawProgress);
  update(a, progress, true); // Offset the first element by 100% to avoid overlap
  update(b, (progress + 0.5) % 1, false); // Offset the second element by half a cycle
  requestAnimationFrame(tick);
};

requestAnimationFrame(tick);
