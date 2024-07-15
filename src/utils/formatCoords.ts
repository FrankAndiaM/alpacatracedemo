import proj4 from 'proj4';

function UTMLetterDesignator(Lat: number) {
  let LetterDesignator: string;
  if (84 >= Lat && Lat >= 72) LetterDesignator = 'X';
  else if (72 > Lat && Lat >= 64) LetterDesignator = 'W';
  else if (64 > Lat && Lat >= 56) LetterDesignator = 'V';
  else if (56 > Lat && Lat >= 48) LetterDesignator = 'U';
  else if (48 > Lat && Lat >= 40) LetterDesignator = 'T';
  else if (40 > Lat && Lat >= 32) LetterDesignator = 'S';
  else if (32 > Lat && Lat >= 24) LetterDesignator = 'R';
  else if (24 > Lat && Lat >= 16) LetterDesignator = 'Q';
  else if (16 > Lat && Lat >= 8) LetterDesignator = 'P';
  else if (8 > Lat && Lat >= 0) LetterDesignator = 'N';
  else if (0 > Lat && Lat >= -8) LetterDesignator = 'M';
  else if (-8 > Lat && Lat >= -16) LetterDesignator = 'L';
  else if (-16 > Lat && Lat >= -24) LetterDesignator = 'K';
  else if (-24 > Lat && Lat >= -32) LetterDesignator = 'J';
  else if (-32 > Lat && Lat >= -40) LetterDesignator = 'H';
  else if (-40 > Lat && Lat >= -48) LetterDesignator = 'G';
  else if (-48 > Lat && Lat >= -56) LetterDesignator = 'F';
  else if (-56 > Lat && Lat >= -64) LetterDesignator = 'E';
  else if (-64 > Lat && Lat >= -72) LetterDesignator = 'D';
  else if (-72 > Lat && Lat >= -80) LetterDesignator = 'C';
  else LetterDesignator = 'Z'; //This is here as an error flag to show that the Latitude is outside the UTM limits

  return LetterDesignator;
}

/**
 * Funcion que convierte un arreglo de coordenadas en formato UTM
 * @param arrCoords arreglo de coordenadas en grados decimales [ lat, lng ]
 *
 */

function utmzone_from_lon(lon_deg: number) {
  //get utm-zone from longitude degrees
  return parseInt(`${((lon_deg + 180) / 6) % 60}`) + 1;
}

function proj4_setdef(lon_deg: number, lat_deg: number) {
  //get UTM projection definition from longitude
  const utm_zone = utmzone_from_lon(lon_deg);
  // const zdef = `+proj=utm +zone=${utm_zone} +datum=WGS84 +units=m +no_defs`;
  const zdef = `+proj=utm +zone=${utm_zone} +datum=WGS84 +ellps=WGS84 ${lat_deg < 0 ? '+south' : ''}`;
  return zdef;
}

/**
 * Funcion que convierte un arreglo de coordenadas en formato UTM
 * @param arrCoords arreglo de coordenadas en grados decimales [ lng, lat ]
 * @returns String coordenadas en formato UTM
 */
export function convertGDToUTM(arrCoords: Array<any>): string {
  const lon_input = Number(arrCoords[0]);
  const lat_input = Number(arrCoords[1]);
  const azone = utmzone_from_lon(lon_input);
  const bzone = UTMLetterDesignator(lat_input);

  //+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees

  //+proj=latlong +datum=WGS84 +ellps=WGS84 +towgs84=0,0,0
  proj4.defs([
    ['EPSG:4326', '+title=WGS 84 (long/lat) +proj=longlat +datum=WGS84 +ellps=WGS84'],
    ['EPSG:32633', proj4_setdef(lon_input, lat_input)]
  ]);

  // console.log([lon_input, lat_input]);
  const en_m = proj4('EPSG:4326', 'EPSG:32633', [lon_input, lat_input]);
  // console.log(en_m);
  const e4digits = en_m[0].toFixed(0); //easting
  const n4digits = en_m[1].toFixed(0); //northing

  return `${azone}${bzone} ${e4digits}mE ${n4digits}mN`;
}
