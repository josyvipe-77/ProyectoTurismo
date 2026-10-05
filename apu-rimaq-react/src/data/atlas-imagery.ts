import type { RasterSourceSpecification } from 'maplibre-gl';

const token = (import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ?? '').trim();
export const usesMapboxImagery = token.startsWith('pk.');
export const satelliteMaxZoom = usesMapboxImagery ? 18 : 13;

// Public client token only; local configuration stays outside the source repository.
export const atlasImagery: RasterSourceSpecification = usesMapboxImagery
  ? {
      type: 'raster',
      tiles: [
        `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=${encodeURIComponent(token)}`,
      ],
      tileSize: 512,
      maxzoom: 20,
      attribution:
        '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="https://www.maxar.com/">Maxar</a> · <a href="https://apps.mapbox.com/feedback/">Improve this map</a>',
    }
  : {
      type: 'raster',
      tiles: ['https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg'],
      tileSize: 256,
      maxzoom: 14,
      attribution:
        '<a href="https://cloudless.eox.at">EOxCloudless</a> by <a href="https://eox.at">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2016 &amp; 2017) · <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> · <a href="https://maps.eox.at">EOX::Maps</a>',
    };
