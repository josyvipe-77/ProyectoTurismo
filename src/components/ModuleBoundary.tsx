import { Component, useEffect } from 'react';
import type { ReactNode } from 'react';
import { releaseBootScene } from '../lib/boot-scene';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
  onError?: () => void;
}

/** Keep the surrounding navigation or SVG map usable if a deferred module fails. */
export class ModuleBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function PageLoadFailure() {
  useEffect(() => releaseBootScene(true), []);
  return (
    <div className="container page" role="alert">
      <h1>No se pudo abrir esta página.</h1>
      <p>
        Comprueba tu conexión y vuelve a cargarla. Tu cuaderno guardado sigue en este navegador.
      </p>
      <button className="button" onClick={() => window.location.reload()}>
        Volver a cargar
      </button>
    </div>
  );
}
