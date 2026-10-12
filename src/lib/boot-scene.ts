let releasing = false;

/** Share the first-paint curtain between the home animation and lazy pages. */
export function releaseBootScene(immediate = false) {
  const curtain = document.getElementById('boot-scene');
  if (!curtain || releasing) return;
  releasing = true;
  const remove = () => {
    window.clearTimeout(timer);
    curtain.removeEventListener('transitionend', onEnd);
    curtain.remove();
    delete document.documentElement.dataset.appBoot;
  };
  const onEnd = (event: TransitionEvent) => {
    if (event.target === curtain && event.propertyName === 'opacity') remove();
  };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timer = window.setTimeout(remove, immediate || reduced ? 0 : 1750);
  curtain.addEventListener('transitionend', onEnd);
  document.documentElement.dataset.appBoot = 'revealing';
}

/** Wait for initial typography and branding, with a bounded network fallback. */
export function prepareBootReveal() {
  if (!document.getElementById('boot-scene')) return () => {};
  let cancelled = false;
  let frame = 0;
  let queued = false;
  const reveal = () => {
    if (cancelled || queued) return;
    queued = true;
    window.clearTimeout(timer);
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if (!cancelled) releaseBootScene();
      });
    });
  };
  const timer = window.setTimeout(reveal, 6000);
  const logo = document.querySelector<HTMLImageElement>('#boot-scene .boot-logo');
  Promise.allSettled([
    logo?.decode(),
    document.fonts.load('600 32px "Montserrat"'),
    document.fonts.load('400 14px "Lato"'),
  ]).then(reveal);
  return () => {
    cancelled = true;
    window.clearTimeout(timer);
    cancelAnimationFrame(frame);
  };
}
