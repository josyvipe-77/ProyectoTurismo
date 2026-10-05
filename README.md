# Apu Rimaq

Prototipo de turismo de Apurímac: React, TypeScript y Vite.

## Ejecutar

Usa Node.js 24.16.0 y npm 11.13.0.

```sh
cd apu-rimaq-react
npm ci
```

Copia `.env.example` a `.env.local`. El token público de Mapbox es opcional; sin él se utiliza la cartografía de respaldo.

```sh
npm run dev
```

Abre <http://localhost:5173>. Para validar los cambios:

```sh
npm run lint
npm run test
npm run build
```

## Documentación para trabajar juntos

- [Incorporación del desarrollador](apu-rimaq-react/docs/DESARROLLO.md): estructura, decisiones y pendientes.
- [Publicar y compartir el repositorio privado](apu-rimaq-react/docs/REPOSITORIO-PRIVADO.md).
- [Recursos y procedencia](apu-rimaq-react/docs/RECURSOS.md).
- [Documentación completa del prototipo](apu-rimaq-react/README.md).

GitHub Actions ejecuta instalación, lint, pruebas y compilación. No despliega el sitio.

## Copia limpia para publicar

La carpeta `Apu-Rimaq-repositorio` contiene una exportación preparada para iniciar un repositorio nuevo. No incluye dependencias, compilados, configuración local ni el historial de los ZIP de entrega.

Para regenerar la exportación desde este espacio de trabajo, con Python 3:

```sh
python apu-rimaq-react/scripts/prepare_private_repo.py --output Apu-Rimaq-repositorio-2
```

El script no sobrescribe una carpeta de destino existente. Para compartir, usa la copia limpia; `.gitignore` no elimina archivos de commits anteriores del espacio de trabajo original.
