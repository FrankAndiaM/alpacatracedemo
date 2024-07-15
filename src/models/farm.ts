import { SystemTable, SystemTableDefault } from './systemTable';
import { Plantings } from './plantings';
// import { LatLngExpression } from 'leaflet';

type feature = {
  type?: string;
  coordinates?: any[][];
};

export const featureDefault: feature = {
  type: ''
};

export type Farm = {
  id: string;
  name: string;
  zone?: SystemTable;
  location?: string;
  plantings?: Plantings[];
  area_sqmt?: feature;
};

export const FarmDefault: Farm = {
  id: '',
  name: '',
  zone: SystemTableDefault,
  plantings: [],
  location: '',
  area_sqmt: featureDefault
};
