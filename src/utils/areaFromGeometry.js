/* eslint-disable @typescript-eslint/typedef */
import geojsonArea from '@mapbox/geojson-area';
import * as Leaflet from 'leaflet';

export const getAreaFromGeometry = (geometry) => {
  const areaM = geojsonArea.geometry(geometry);
  const ha = areaM / 10000;
  return ha.toFixed(2);
};

export const getCenterFromGeoJson = (geoJson) => {
  try {
    const bounds = Leaflet.geoJSON(geoJson).getBounds();
    const p1lat = bounds.getNorthEast().lat;
    const p1lng = bounds.getNorthEast().lng;
    const p2lat = bounds.getSouthWest().lat;
    const p2lng = bounds.getSouthWest().lng;
    const p1 = Leaflet.point(p1lng, p1lat);
    const p2 = Leaflet.point(p2lng, p2lat);
    const { x, y } = Leaflet.bounds(p1, p2).getCenter();
    return [x, y];
  } catch (error) {
    return null;
  }
};
