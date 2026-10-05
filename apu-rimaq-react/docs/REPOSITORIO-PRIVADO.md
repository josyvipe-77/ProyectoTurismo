# Publicar y compartir

## Qué carpeta usar

Usa **`Apu-Rimaq-repositorio`**, la copia limpia que acompaña esta entrega. Tiene los recursos necesarios y no contiene `.git`, `.env.local`, `node_modules`, `dist`, ZIP de entrega ni los archivos de referencias originales.

El Git del espacio de trabajo original tiene un primer commit con archivos ZIP grandes y herramientas de trabajo. Añadir `.gitignore` no los quita del historial. La copia limpia evita trasladar esos objetos y permite iniciar el historial del producto sin modificar el original.

## Publicar en GitHub

1. Crea un repositorio **Private** y vacío: sin README, licencia o `.gitignore` generados por GitHub.
2. Abre una terminal dentro de `Apu-Rimaq-repositorio`.
3. Sustituye `<URL_PRIVADA>` por la URL del repositorio que acabas de crear y ejecuta:

```sh
git init -b main
git add .
git status --short
git commit -m "Preparar Apu Rimaq para desarrollo compartido"
git remote add origin <URL_PRIVADA>
git push -u origin main
```

Revisa la lista antes del commit: debe contener la aplicación, documentación y configuración de CI, no `.env.local` ni ZIP. La copia limpia incorpora un informe de archivos en `PREPARACION.json`.

Si tu repositorio remoto ya tiene commits, usa un clon de ese repositorio y copia estos archivos sobre una rama nueva. No fuerces el push ni reemplaces su historial. El remoto configurado en el espacio de trabajo original no se ha usado para publicar esta entrega; su visibilidad no ha sido verificada.

## Compartir con el otro desarrollador

En el repositorio de GitHub, abre **Settings → Collaborators**, invita su usuario y espera a que acepte. Verifica que la visibilidad continúe en **Private**. Después puede clonar el repositorio con su propia autenticación y seguir `docs/DESARROLLO.md`.

Cada desarrollador crea su `.env.local` desde `.env.example`. Puede utilizar su propio token público de Mapbox o el respaldo sin token.

## Verificaciones y recursos

GitHub Actions ejecutará `npm ci`, lint, pruebas y build en cada push y PR. El workflow solo solicita lectura del repositorio y no usa secretos de producción.

Los recursos locales individuales están por debajo del límite de archivo de GitHub; no se necesita LFS para esta entrega. El ZIP de exportación sirve para transferir la carpeta y **no debe añadirse a Git**. [Límites oficiales de GitHub](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github).

Mantén la procedencia y atribuciones de las fotos, fuentes y mapas. Consulta `RECURSOS.md` antes de reutilizar material fuera del proyecto.
