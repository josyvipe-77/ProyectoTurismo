import { useEffect, useRef, useState } from 'react';

export type HeroIntroPhase = 'waiting' | 'revealing' | 'opening' | 'settling' | 'done';
let hasShownIntro = false;

export function useHeroIntro() {
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<HeroIntroPhase>(() =>
    hasShownIntro ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.location.hash
      ? 'done'
      : 'waiting',
  );

  useEffect(() => {
    const hero = ref.current;
    if (!hero) return;
    const curtain = document.getElementById('boot-scene');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let current = hero.dataset.introPhase;
    let cancelled = false;
    let frame = 0;
    let readinessTimer = 0;
    let finishTimer = 0;
    let curtainTimer = 0;
    let openingTimer = 0;

    const removeCurtain = () => {
      window.clearTimeout(curtainTimer);
      curtain?.remove();
      delete document.documentElement.dataset.homeBoot;
    };
    const onCurtainEnd = (event: TransitionEvent) => {
      if (event.target === curtain && event.propertyName === 'opacity') removeCurtain();
    };
    const releaseCurtain = () => {
      if (!curtain || curtainTimer) return;
      document.documentElement.dataset.homeBoot = 'revealing';
      // The CSS transition owns the exit; the timer only covers missing events.
      curtainTimer = window.setTimeout(removeCurtain, preference.matches ? 0 : 1750);
    };
    const finish = () => {
      current = 'done';
      hasShownIntro = true;
      setPhase('done');
    };
    const settle = () => {
      if (current === 'done' || current === 'settling') return;
      window.clearTimeout(readinessTimer);
      window.clearTimeout(openingTimer);
      window.clearTimeout(finishTimer);
      window.cancelAnimationFrame(frame);
      releaseCurtain();
      current = 'settling';
      hasShownIntro = true;
      setPhase('settling');
      finishTimer = window.setTimeout(finish, preference.matches ? 0 : 1200);
    };
    const open = () => {
      if (cancelled || current !== 'revealing') return;
      current = 'opening';
      setPhase('opening');
    };
    const reveal = () => {
      frame = 0;
      if (cancelled || current !== 'waiting') return;
      window.clearTimeout(readinessTimer);
      current = 'revealing';
      setPhase('revealing');
      releaseCurtain();
      hasShownIntro = true;
      // Clouds already drift during the handoff; only the text entrance waits.
      openingTimer = window.setTimeout(open, 1000);
      finishTimer = window.setTimeout(finish, 4400);
    };
    const queueReveal = () => {
      if (cancelled || current !== 'waiting' || frame) return;
      // Cached media can resolve before the initial styles have been painted.
      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(reveal);
      });
    };
    const onScroll = () => {
      if (window.scrollY > 20) settle();
    };
    const onPreference = () => {
      if (preference.matches) settle();
    };

    if (current === 'done') {
      removeCurtain();
      return;
    }

    const image = hero.querySelector<HTMLImageElement>('.hero-image');
    hero.dataset.imageReady = 'false';
    const imageReady = image?.decode().then(() => {
      if (!cancelled) hero.dataset.imageReady = 'true';
    });
    const cloud = new Image();
    cloud.src = '/images/cloud-wisp.webp';
    // Keep the first-paint curtain until media decode and font layout settle.
    const fonts = Promise.all([
      document.fonts.load('400 76px "Montserrat"'),
      document.fonts.load('600 76px "Montserrat"'),
      document.fonts.load('400 14px "Lato"'),
      document.fonts.load('700 14px "Lato"'),
    ]);
    Promise.allSettled([imageReady, cloud.decode(), fonts]).then(() => {
      queueReveal();
    });
    readinessTimer = window.setTimeout(queueReveal, 6000);
    curtain?.addEventListener('transitionend', onCurtainEnd);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', settle, { passive: true });
    window.addEventListener('touchstart', settle, { passive: true });
    window.addEventListener('pointerdown', settle, { passive: true });
    window.addEventListener('keydown', settle);
    preference.addEventListener('change', onPreference);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(readinessTimer);
      window.clearTimeout(finishTimer);
      window.clearTimeout(curtainTimer);
      window.clearTimeout(openingTimer);
      curtain?.removeEventListener('transitionend', onCurtainEnd);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', settle);
      window.removeEventListener('touchstart', settle);
      window.removeEventListener('pointerdown', settle);
      window.removeEventListener('keydown', settle);
      preference.removeEventListener('change', onPreference);
      delete hero.dataset.imageReady;
      // Strict Mode rehearses effects before paint: retain that first curtain.
      if (current !== 'waiting' || !hero.isConnected) removeCurtain();
    };
  }, []);

  return { ref, phase };
}
