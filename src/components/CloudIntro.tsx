import type { HeroIntroPhase } from '../hooks/useHeroIntro';

export function CloudIntro({ phase }: { phase: HeroIntroPhase }) {
  if (phase === 'done') return null;

  return (
    <div className="cloud-intro" data-phase={phase} aria-hidden="true">
      <div className="cloud-intro-veil" />
      <div className="cloud-bank cloud-bank-left" />
      <div className="cloud-bank cloud-bank-right" />
      <div className="cloud-bank cloud-bank-near" />
    </div>
  );
}
