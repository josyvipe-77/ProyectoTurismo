export function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <img
      className={`brand-logo ${className}`}
      src="/images/jacs-destinos-logo-transparent.png"
      alt="JACS Destinos · Consultoría de turismo"
      width="1774"
      height="887"
      decoding="async"
    />
  );
}
