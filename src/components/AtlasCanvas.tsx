import { useEffect, useRef, useState } from 'react';
import {
  Map,
  Marker,
  NavigationControl,
  setWorkerUrl,
  LngLatBounds,
  GeoJSONSource,
} from 'maplibre-gl';
import type { Feature, FeatureCollection, Polygon } from 'geojson';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';
import boundary from '../data/apurimac-boundary.json';
import { regionBounds } from '../data/apurimac-places';
import type { TouristPlace } from '../data/apurimac-places';
import { atlasImagery, satelliteMaxZoom } from '../data/atlas-imagery';
import { destinationArtwork } from '../data/destination-illustrations';
import { AtlasDestinationCallout } from './AtlasDestinationCallout';

setWorkerUrl(workerUrl);
const region = boundary as Feature<Polygon>;
const regionalMask: Feature<Polygon> = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-180, -85],
        [180, -85],
        [180, 85],
        [-180, 85],
        [-180, -85],
      ],
      [...region.geometry.coordinates[0]].reverse(),
    ],
  },
};
function destinationSignals(places: TouristPlace[]): FeatureCollection<Polygon> {
  return {
    type: 'FeatureCollection',
    features: places.map((place) => {
      const [longitude, latitude] = place.coordinates;
      const ring = Array.from({ length: 25 }, (_, index) => {
        const angle = (index / 24) * Math.PI * 2;
        return [
          longitude + (Math.cos(angle) * 35) / (111320 * Math.cos((latitude * Math.PI) / 180)),
          latitude + (Math.sin(angle) * 35) / 111320,
        ];
      });
      return {
        type: 'Feature',
        properties: { id: place.id },
        geometry: { type: 'Polygon', coordinates: [ring] },
      };
    }),
  };
}

type Props = {
  places: TouristPlace[];
  sequence: boolean;
  selected: number | null;
  threeD: boolean;
  satellite: boolean;
  onSelect: (index: number) => void;
  onSatelliteChange: (enabled: boolean) => void;
  onStatus: (status: 'loading' | 'ready' | 'unavailable') => void;
};

export default function AtlasCanvas({
  places,
  sequence,
  selected,
  threeD,
  satellite,
  onSelect,
  onSatelliteChange,
  onStatus,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [readyMap, setReadyMap] = useState<Map | null>(null);
  const activePlace = selected === null ? null : places[selected];
  const markers = useRef<Marker[]>([]);
  const current = useRef({ selected, threeD, satellite, onSelect, places, sequence });
  const updatePoints = useRef<(() => void) | null>(null);
  const updateCamera = useRef<(() => void) | null>(null);
  const updateSurface = useRef<(() => void) | null>(null);
  useEffect(() => {
    current.current = { selected, threeD, satellite, onSelect, places, sequence };
  }, [selected, threeD, satellite, onSelect, places, sequence]);

  useEffect(() => {
    if (!host.current) return;
    let alive = true;
    let loaded = false;
    let map: Map;
    const fail = () => {
      if (alive) onStatus('unavailable');
    };
    const timeout = window.setTimeout(fail, 25000);
    try {
      map = new Map({
        container: host.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [-72.94, -14.01],
        zoom: 7,
        pitch: 0,
        // Supersample labels and geometry without allocating an unbounded mobile canvas.
        pixelRatio: 2,
        canvasContextAttributes: { antialias: true },
        // Camera margins keep verified destinations visible around the simplified outline.
        maxBounds: [
          [regionBounds[0][0] - 0.65, regionBounds[0][1] - 0.5],
          [regionBounds[1][0] + 0.65, regionBounds[1][1] + 0.5],
        ],
        minZoom: 6,
        maxZoom: 15,
        maxPitch: 55,
        keyboard: false,
        cooperativeGestures: true,
        attributionControl: { compact: true },
        locale: {
          'Map.Title': 'Mapa de Apurímac',
          'NavigationControl.ZoomIn': 'Acercar mapa',
          'NavigationControl.ZoomOut': 'Alejar mapa',
          'NavigationControl.ResetBearing': 'Orientar al norte',
          'AttributionControl.ToggleAttribution': 'Ver atribución del mapa',
        },
      });
    } catch {
      window.clearTimeout(timeout);
      fail();
      return;
    }
    // Page scrolling remains natural; chapters are explicitly selected by the visitor.
    map.scrollZoom.disable();
    map.addControl(new NavigationControl({ showCompass: true }), 'bottom-right');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const surface = () => {
      if (!loaded || !alive) return;
      const imagery = current.current.satellite;
      // Limit overzoom according to the available photographic source.
      map.setMaxZoom(imagery ? satelliteMaxZoom : 15);
      map.setLayoutProperty('apurimac-satellite', 'visibility', imagery ? 'visible' : 'none');
      map.setPaintProperty('apurimac-shading', 'hillshade-exaggeration', imagery ? 0 : 0.1);
      map.setPaintProperty('apurimac-border', 'line-color', imagery ? '#e4b46a' : '#284d40');
      // Only text labels are retained above the photograph; native raster colors stay intact.
      for (const layer of map.getStyle().layers ?? []) {
        if (layer.type === 'symbol' && layer.layout?.['text-field']) {
          map.setPaintProperty(layer.id, 'text-color', imagery ? '#fff9ef' : '#292820');
          map.setPaintProperty(layer.id, 'text-halo-color', imagery ? '#19291fee' : '#fff9f5');
          map.setPaintProperty(layer.id, 'text-halo-width', imagery ? 1.5 : 1.2);
        }
      }
    };
    updateSurface.current = surface;
    const position = () => {
      if (!loaded || !alive) return;
      const { selected: index, threeD: relief } = current.current;
      const active = index === null ? null : current.current.places[index];
      map.stop();
      map.setTerrain(relief ? { source: 'apurimac-terrain', exaggeration: 1.1 } : null);
      map.setLayoutProperty('destination-signals', 'visibility', relief ? 'visible' : 'none');
      map.setPaintProperty('destination-signals', 'fill-extrusion-color', [
        'case',
        ['==', ['get', 'id'], active?.id ?? ''],
        '#284d40',
        '#b6904b',
      ]);
      map.setPaintProperty('destination-signals', 'fill-extrusion-height', [
        'case',
        ['==', ['get', 'id'], active?.id ?? ''],
        90,
        45,
      ]);
      markers.current.forEach((marker, markerIndex) => {
        // The pin stays centered on its coordinates; only its text label may move.
        marker.setOffset([0, 0]);
        const button = marker.getElement();
        button.classList.toggle('is-active', markerIndex === index);
        button.setAttribute('aria-pressed', String(markerIndex === index));
        button.classList.toggle('is-muted', index !== null && markerIndex !== index);
        button.classList.toggle('is-overview', index === null);
      });
      const duration = motion.matches ? 0 : 1400;
      if (active)
        map.easeTo({
          center: active.coordinates,
          zoom: Math.min(active.zoom, map.getMaxZoom()),
          bearing: relief ? active.bearing : 0,
          // A shallower camera reduces texture stretching across the foreground slopes.
          pitch: relief ? 48 : 0,
          padding: 0,
          offset: destinationArtwork(active.id) ? [0, 55] : [0, 0],
          duration,
        });
      else if (current.current.sequence && current.current.places.length > 1) {
        const bounds = new LngLatBounds();
        current.current.places.forEach((place) => bounds.extend(place.coordinates));
        const narrow = map.getContainer().clientWidth < 480;
        map.fitBounds(bounds, {
          padding: {
            top: narrow ? 95 : 90,
            bottom: 65,
            left: narrow ? 48 : 65,
            right: narrow ? 48 : 65,
          },
          maxZoom: 12.3,
          pitch: 0,
          bearing: 0,
          duration,
        });
      } else
        map.fitBounds(regionBounds, {
          padding: { top: 95, bottom: 65, left: 45, right: 45 },
          pitch: 0,
          bearing: 0,
          duration,
        });
    };
    updateCamera.current = position;
    const points = () => {
      if (!loaded || !alive) return;
      const source = map.getSource('destination-signals');
      if (source instanceof GeoJSONSource)
        source.setData(destinationSignals(current.current.places));
      markers.current.forEach((marker) => marker.remove());
      markers.current = current.current.places.map((place, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `atlas-pin atlas-pin-${place.id}`;
        button.dataset.placeId = place.id;
        button.dataset.longitude = String(place.coordinates[0]);
        button.dataset.latitude = String(place.coordinates[1]);
        button.dataset.labelPlacement = index % 2 === 1 ? 'above' : 'below';
        button.setAttribute('aria-label', `Explorar ${place.name}`);
        button.title = place.name;
        const leader = document.createElement('span');
        leader.className = 'atlas-pin-leader';
        leader.setAttribute('aria-hidden', 'true');
        const number = document.createElement('span');
        number.className = 'atlas-pin-number';
        number.textContent = place.mapLabel ?? String(index + 1);
        const name = document.createElement('span');
        name.className = 'atlas-pin-name';
        name.textContent = place.shortName;
        button.append(leader, number, name);
        button.addEventListener('click', () => current.current.onSelect(index));
        return new Marker({ element: button, anchor: 'center' })
          .setLngLat(place.coordinates)
          .addTo(map);
      });
      position();
    };
    updatePoints.current = points;
    map.on('style.load', () => {
      if (!alive) return;
      map.addSource('apurimac-imagery', atlasImagery);
      // Preserve detail on distant slopes instead of quickly falling back to coarse tiles.
      map.setSourceTileLodParams(2, 4, 'apurimac-imagery');
      const labels = map.getStyle().layers?.find((layer) => layer.type === 'symbol')?.id;
      map.addLayer(
        {
          id: 'apurimac-satellite',
          type: 'raster',
          source: 'apurimac-imagery',
          layout: { visibility: current.current.satellite ? 'visible' : 'none' },
          paint: {
            'raster-fade-duration': 450,
            'raster-saturation': 0,
            'raster-contrast': 0.03,
            'raster-brightness-min': 0,
            'raster-brightness-max': 1,
            'raster-resampling': 'linear',
          },
        },
        labels,
      );
      // The simplified boundary must not hide verified locations near its edge.
      map.addSource('apurimac-region', { type: 'geojson', data: region });
      map.addSource('apurimac-mask', { type: 'geojson', data: regionalMask });
      map.addLayer({
        id: 'apurimac-outside',
        type: 'fill',
        source: 'apurimac-mask',
        paint: { 'fill-color': '#eee6d7', 'fill-opacity': 0.12 },
      });
      map.addLayer({
        id: 'apurimac-border',
        type: 'line',
        source: 'apurimac-region',
        paint: { 'line-color': '#284d40', 'line-width': 1.8, 'line-opacity': 0.8 },
      });
      map.addSource('apurimac-terrain', {
        type: 'raster-dem',
        url: 'https://tiles.mapterhorn.com/tilejson.json',
        encoding: 'terrarium',
        tileSize: 512,
      });
      map.addSource('apurimac-hillshade', {
        type: 'raster-dem',
        url: 'https://tiles.mapterhorn.com/tilejson.json',
        encoding: 'terrarium',
        tileSize: 512,
      });
      map.addLayer(
        {
          id: 'apurimac-shading',
          type: 'hillshade',
          source: 'apurimac-hillshade',
          paint: {
            'hillshade-exaggeration': 0.1,
            'hillshade-shadow-color': '#142b27',
            'hillshade-highlight-color': '#fff8e6',
          },
        },
        'apurimac-outside',
      );
      map.addSource('destination-signals', {
        type: 'geojson',
        data: destinationSignals(current.current.places),
      });
      map.addLayer({
        id: 'destination-signals',
        type: 'fill-extrusion',
        source: 'destination-signals',
        paint: {
          'fill-extrusion-color': '#b6904b',
          'fill-extrusion-height': 45,
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.5,
        },
      });
      loaded = true;
      points();
      surface();
      position();
    });
    map.once('load', () => {
      if (!alive) return;
      window.clearTimeout(timeout);
      onStatus('ready');
      setReadyMap(map);
    });
    map.on('error', (event) => {
      // A broken base style or elevation source must not present a false 3D success state.
      const sourceId = 'sourceId' in event ? event.sourceId : null;
      if (sourceId === 'apurimac-imagery' || event.error.message.includes('tiles.maps.eox.at')) {
        onSatelliteChange(false);
        return;
      }
      if (!loaded || sourceId === 'apurimac-terrain' || sourceId === 'apurimac-hillshade') {
        window.clearTimeout(timeout);
        fail();
      }
    });
    const resize = new ResizeObserver(() => {
      map.resize();
      position();
    });
    resize.observe(host.current);
    motion.addEventListener('change', position);
    return () => {
      alive = false;
      window.clearTimeout(timeout);
      motion.removeEventListener('change', position);
      resize.disconnect();
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
      updateCamera.current = null;
      updateSurface.current = null;
      updatePoints.current = null;
      map.remove();
    };
  }, [onStatus, onSatelliteChange]);

  useEffect(() => {
    updatePoints.current?.();
  }, [places, sequence]);

  useEffect(() => {
    updateCamera.current?.();
  }, [selected, threeD]);
  useEffect(() => {
    updateSurface.current?.();
  }, [satellite]);
  return (
    <>
      <div
        ref={host}
        className="atlas-canvas"
        data-imagery-provider={satellite ? 'eox' : 'openfreemap'}
      />
      {readyMap && activePlace && destinationArtwork(activePlace.id) && (
        <AtlasDestinationCallout key={activePlace.id} map={readyMap} place={activePlace} />
      )}
    </>
  );
}
