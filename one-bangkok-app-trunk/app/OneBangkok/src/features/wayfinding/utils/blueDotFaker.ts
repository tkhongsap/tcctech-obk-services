import {
  Mappedin,
  MappedinDirections,
  MappedinMap,
  MappedinNode,
  TGeolocationObject,
} from '@mappedin/react-native-sdk';
import LatLonSpherical from 'geodesy/latlon-spherical';

// These values are used to populate the fake geolocation data but do not affect the blue dot
const TIME_TICK = 1000; // ms
const START_TIME = 1583957906820;

type PathPosition = {
  coords: LatLonSpherical;
  floorLevel: number;
};

export type PositionUpdatesOptions = {
  maxJitter: number;
  accuracy: number;
};

const defaultOptions: PositionUpdatesOptions = {
  maxJitter: 0,
  accuracy: 5,
};

/**
 * Reverse implementation of mapView.getPositionLatLon()
 */
export const getLatLonFromXY = (
  x: number,
  y: number,
  map: MappedinMap,
): LatLonSpherical => {
  const anchor = map.georeference[0];
  const anchorLatLon = new LatLonSpherical(anchor.target.x, anchor.target.y);

  const deltaX = x - anchor.control.x;
  const deltaY = anchor.control.y - y;

  const mappedinBearing = Math.atan2(deltaX, deltaY);
  const mappedinDistance = deltaX / Math.sin(mappedinBearing);

  const worldBearing = mappedinBearing - map.getNorth();
  const worldDistance = mappedinDistance / map._scale;

  const targetLatLon = anchorLatLon.destinationPoint(
    worldDistance,
    (worldBearing * 180) / Math.PI,
  );

  return targetLatLon;
};

/**
 * Convert a node on the path to LatLon coords and floorLevel
 */
export const getPathPositionFromNode = (
  node: MappedinNode,
  map: MappedinMap,
): PathPosition | undefined => {
  const coords = getLatLonFromXY(node.x, node.y, map);
  const floorLevel = map.elevation;
  return {
    coords,
    floorLevel,
  };
};

/**
 * Generate an array of geolocation updates from path positions
 */
export const getPositionUpdates = (
  path: PathPosition[],
  acc: number,
): TGeolocationObject[] => {
  return path.map(
    (p, i) =>
      ({
        timestamp: START_TIME + TIME_TICK * i,
        coords: {
          accuracy: acc,
          latitude: p.coords.lat,
          longitude: p.coords.lon,
          floorLevel: p.floorLevel,
        },
        type: 0, // GEOLOCATION_STATUS enum not able to be imported?
      } as TGeolocationObject),
  );
};

/**
 * Add innacuracy and randomness to the position updates
 */
export const addJitter = (
  path: PathPosition[],
  jitter: number,
): PathPosition[] => {
  return path.map(p => {
    const newPosition: PathPosition = {...p};
    const randomOffset = Math.random() * jitter;
    const randomBearing = Math.random() * 360;
    newPosition.coords = p.coords.destinationPoint(randomOffset, randomBearing);
    return newPosition;
  });
};

/**
 * Generate an array of fake geolocation updates for a set of MappedinDirections
 */
export const generatePositionUpdates = (
  venue: Mappedin,
  directions: MappedinDirections,
  options: Partial<PositionUpdatesOptions> = {},
): TGeolocationObject[] | undefined => {
  if (venue == null) {
    return;
  }
  const optionsWithDefaults: PositionUpdatesOptions = {
    ...defaultOptions,
    ...options,
  };

  // Get the path nodes from directions
  const nodesInPath: MappedinNode[] = [...directions.path];

  // Map them to LatLon coords and floor levels
  const path: PathPosition[] = nodesInPath
    .map(node => {
      const map = venue.maps.find(m => m.id === node.map.id);
      return map ? getPathPositionFromNode(node, map) : undefined;
    })
    .filter(x => x) as PathPosition[];

  // Add optional jitter
  const jitteryPath = addJitter(path, optionsWithDefaults.maxJitter);

  // Generate a set of geolocation updates
  const positionUpdates = getPositionUpdates(
    jitteryPath,
    optionsWithDefaults.accuracy,
  );
  return positionUpdates;
};
