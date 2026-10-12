import type { RasterSourceSpecification } from 'maplibre-gl';

export const satelliteMaxZoom = 13;

// Historical Sentinel-2 imagery; attribution is required, no account or token is used.
export const atlasImagery: RasterSourceSpecification = {
  type: 'raster',
  tiles: ['https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg'],
  tileSize: 256,
  maxzoom: 14,
  attribution:
    '<a href="https://cloudless.eox.at">EOxCloudless</a> by <a href="https://eox.at">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2016 &amp; 2017) · <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> · <a href="https://maps.eox.at">EOX::Maps</a>',
};
