# JACS Destinos

Sitio académico COIL USC–UNAMBA para **Apurímac a través de tu objetivo**: cinco jornadas de fotografía, naturaleza y patrimonio, con base en Abancay.

## Ejecutar

Usa Node.js 24 y npm 11. La versión de Node recomendada está en `.nvmrc`. La aplicación está en la raíz del repositorio `ProyectoTurismo`, junto a `package.json`; ejecuta todos los comandos desde esa carpeta:

```sh
npm ci
npm run dev
```

Abre http://localhost:5173. No se necesitan tokens, variables de entorno, Python ni una base de datos para ejecutar la aplicación.

## Comprobar y compilar

```sh
npm run lint
npm test
npm run format:check
npm run build
```

`npm test` comprueba también la lectura de cuadernos y favoritos antiguos, sin sobrescribirlos. `npm run format` aplica el formato del proyecto. Para revisar la compilación localmente, usa `npm run preview`.

## Páginas

| Ruta            | Contenido                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------ |
| `/`             | Presentación, paisaje y animación de apertura.                                             |
| `/experiencia`  | Programa, público y servicios previstos.                                                   |
| `/construye`    | Planificación de cinco días, miradores, servicios, presupuesto orientativo y descarga TXT. |
| `/rutas`        | Catálogo regional, circuitos, mapas y galerías.                                            |
| `/cultura`      | Contexto cultural y calendario orientativo.                                                |
| `/consultora`   | Equipo de JACS Destinos y proyecto COIL.                                                   |
| `/rutas/chanka` | Redirección a Planifica tu viaje para conservar enlaces anteriores.                        |

Las elecciones del programa y los datos anteriores se guardan únicamente en el navegador. No hay cuentas, reservas, pagos ni envío de consultas. Accesos, horarios, disponibilidad y proveedores requieren confirmación local; los importes del planificador son estimaciones.

## Estructura

- `src/`: aplicación React y TypeScript, estilos, datos y validadores.
- `public/`: fotografías, logo, mapas, licencias y folleto utilizado por la web.
- `tests/`: pruebas de lógica, datos y compatibilidad.
- `scripts/`: comprobación de almacenamiento y exportación de una copia limpia.
- `research/`: fuentes, evidencia e importadores del inventario turístico.
- `docs/`: desarrollo, publicación y procedencia de recursos.

El mapa utiliza MapLibre, OpenFreeMap, Mapterhorn e imágenes históricas EOX. El satélite tiene detalle limitado y los servicios cartográficos requieren internet. Se conservan atribuciones y respaldos cuando falla la carga. Las páginas secundarias y el motor del mapa se cargan bajo demanda.

## Preparar para Git

La carpeta principal está preparada para versionar. `.gitignore` excluye dependencias, compilados, cachés, configuración local, documentos de entrega, capturas, pruebas temporales y copias exportadas. Los documentos de entrega y las copias de trabajo se conservan localmente y quedan fuera del repositorio.

Para generar opcionalmente otra carpeta limpia y su ZIP, con Python 3:

```sh
python scripts/prepare_private_repo.py --output JACS-Destinos-repositorio
```

El exportador no sobrescribe destinos y genera un manifiesto de archivos. El ZIP no debe subirse a Git. La aplicación no publica ni despliega el sitio automáticamente. El HTML incluye `noindex, nofollow`.

## Documentación

- [Guía de desarrollo](docs/DESARROLLO.md).
- [Colaborar en el repositorio](docs/REPOSITORIO-PRIVADO.md).
- [Procedencia y licencias](docs/RECURSOS.md).

Las entregas y las copias de trabajo se mantienen fuera del repositorio; si se utiliza una carpeta local `qa/`, queda excluida de Git.
