# Colaborar en ProyectoTurismo

## Repositorio y estructura

El repositorio compartido es [MarcoAnto619/ProyectoTurismo](https://github.com/MarcoAnto619/ProyectoTurismo). La rama de integración es `develop`.

La aplicación se ejecuta desde la raíz: `package.json`, `src/`, `public/`, `tests/` y `.github/workflows/` están en el mismo repositorio. Abre esa carpeta como proyecto en tu editor y ejecuta allí los comandos de npm y Git.

## Preparar una copia local

Acepta la invitación de colaboración en GitHub antes de clonar el repositorio privado:

```sh
git clone --branch develop https://github.com/MarcoAnto619/ProyectoTurismo.git ProyectoTurismo
cd ProyectoTurismo
```

Configura la identidad de los commits solo para esta copia. Sustituye los valores por tu nombre y correo de GitHub:

```sh
git config --local user.name "Tu nombre"
git config --local user.email "Tu correo de GitHub"
```

Esta configuración no cambia la identidad de otros repositorios. La autenticación con GitHub se realiza con la cuenta que tiene acceso al proyecto.

## Trabajar en una rama

Desde `develop`, crea una rama para tus cambios. La rama utilizada para esta actualización es `jjvp`:

```sh
git switch develop
git pull --ff-only origin develop
git switch -c jjvp
```

Si ya estás en `jjvp`, continúa en ella; no repitas su creación. Para otro cambio, elige otro nombre de rama.

Si trabajaste sobre una descarga ZIP, traslada el código y los recursos a la copia clonada, conservando su carpeta `.git`. Los cambios y la configuración deben corresponder a la estructura de la raíz. Antes de reemplazar archivos, conserva una copia de tu trabajo.

## Verificar y subir cambios

Usa Node.js 24 y npm 11. Instala las dependencias y comprueba el proyecto:

```sh
npm ci
npm run lint
npm test
npm run format:check
npm run build
```

Para revisarlo en el navegador, ejecuta `npm run dev` y abre la dirección que indique la terminal.

Revisa los archivos antes de guardar el commit:

```sh
git status --short
git add -A
git diff --cached --stat
git diff --cached --check
git status
```

La lista debe incluir el código, las pruebas, la documentación y los recursos de la aplicación. `.gitignore` excluye dependencias, compilados, cachés, configuración local, entregas y copias exportadas. Los recursos de `public/materiales` sí pertenecen al sitio. En un repositorio existente, `.gitignore` no retira archivos ya versionados.

Después de revisar los cambios:

```sh
git commit -m "Actualizar proyecto turístico y reorganizar aplicación en la raíz"
git push -u origin jjvp
```

En GitHub, abre un pull request con `base: develop` y `compare: jjvp`. Describe los cambios y las comprobaciones realizadas. Los commits posteriores enviados a la misma rama actualizan ese pull request.

Conserva el historial del repositorio y evita reemplazarlo con un push forzado.

## Copia de entrega opcional

Con Python 3 puedes generar una carpeta independiente y su ZIP:

```sh
python scripts/prepare_private_repo.py --output JACS-Destinos-repositorio
```

El exportador no sobrescribe destinos. Incluye el código, los recursos, las pruebas, la documentación, la investigación y CI, y genera `PREPARACION.json` dentro de la copia con tamaños y hashes. Excluye el historial de Git, las dependencias y las carpetas locales de trabajo.

El manifiesto pertenece a esa entrega y no debe mantenerse en la raíz del repositorio de desarrollo. La carpeta exportada y su ZIP quedan excluidos de Git.

## Comprobaciones automáticas

GitHub Actions instala las dependencias y ejecuta lint, formato, pruebas y compilación desde la raíz. No usa credenciales de producción ni despliega el sitio. Mantén las atribuciones y fuentes descritas en [RECURSOS.md](RECURSOS.md).
