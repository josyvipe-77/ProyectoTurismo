import { useEffect, useRef } from 'react';

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => {
  const progress = clamp(value);
  return progress * progress * (3 - 2 * progress);
};

/** Scroll owns the motion; React only mounts and cleans up the controller. */
export function useHomeMotion() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const hero = root?.querySelector<HTMLElement>('.hero');
    if (!root || !hero) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sections = [...root.querySelectorAll<HTMLElement>('.container > section')];
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    let heroTop = 0;
    let heroHeight = 1;
    let previous = -1;

    const paint = () => {
      frame = 0;
      const progress = preference.matches ? 0 : clamp((window.scrollY - heroTop) / heroHeight);
      if (progress === previous) return;
      previous = progress;
      hero.style.setProperty('--hero-pan', `${(progress * heroHeight * 0.28).toFixed(2)}px`);
      hero.style.setProperty('--hero-scale', String(1.04 + progress * 0.065));
      hero.style.setProperty('--hero-copy-shift', `${(progress * heroHeight * 0.1).toFixed(2)}px`);
      hero.style.setProperty('--hero-copy-opacity', String(1 - ease(progress / 0.85)));
      hero.style.setProperty('--hero-blend', String(ease(progress / 0.32)));
      hero.style.setProperty('--hero-hint-opacity', String(1 - ease(progress / 0.3)));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    const measure = () => {
      const bounds = hero.getBoundingClientRect();
      heroTop = bounds.top + window.scrollY;
      heroHeight = Math.max(bounds.height, 1);
      previous = -1;
      schedule();
    };
    const configure = () => {
      observer?.disconnect();
      sections.forEach((section) => section.removeAttribute('data-reveal'));
      if (!preference.matches && 'IntersectionObserver' in window) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.setAttribute('data-reveal', 'visible');
                observer?.unobserve(entry.target);
              }
            });
          },
          { threshold: 0, rootMargin: '0px 0px -40px 0px' },
        );
        sections.forEach((section) => {
          // Leave content already in view untouched (including deep links).
          if (section.getBoundingClientRect().top >= window.innerHeight) {
            section.setAttribute('data-reveal', 'pending');
            observer?.observe(section);
          }
        });
      }
      measure();
    };

    const resize = new ResizeObserver(measure);
    resize.observe(hero);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    preference.addEventListener('change', configure);
    configure();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      preference.removeEventListener('change', configure);
      observer?.disconnect();
      resize.disconnect();
      sections.forEach((section) => section.removeAttribute('data-reveal'));
      ['pan', 'scale', 'copy-shift', 'copy-opacity', 'blend', 'hint-opacity'].forEach((name) =>
        hero.style.removeProperty(`--hero-${name}`),
      );
    };
  }, []);

  return ref;
}
