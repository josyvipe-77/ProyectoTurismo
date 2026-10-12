export function PageLoader() {
  return (
    <div
      className="page-loader"
      role="status"
      aria-live="polite"
      aria-label="Cargando JACS Destinos"
    >
      <div className="boot-inner" aria-hidden="true">
        <img
          className="boot-logo"
          src="/images/jacs-destinos-logo-transparent.png"
          alt=""
          width="1774"
          height="887"
        />
        <div className="boot-track">
          <span />
        </div>
        <span className="boot-caption">Abriendo tu próxima mirada</span>
      </div>
    </div>
  );
}
