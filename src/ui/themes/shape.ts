/* eslint-disable @typescript-eslint/consistent-type-definitions */

import { Shape } from '@mui/system';

declare module '@mui/system' {
  interface Shape {
    borderRadiusSm: number | string;
    borderRadiusMd: number | string;
  }
}

const shape: Shape = {
  borderRadius: 8,
  borderRadiusSm: 12,
  borderRadiusMd: 16
};

export default shape;
