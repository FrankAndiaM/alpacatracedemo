/* eslint-disable @typescript-eslint/typedef */
import React, { useState, useEffect } from 'react';
import { useMap, MapContainer, TileLayer, FeatureGroup, Marker, Popup, Polygon } from 'react-leaflet';
// import { EditControl } from 'react-leaflet-draw';
import { Box } from '@mui/material';
// import { showMessage } from '~utils/Messages';
import L from 'leaflet';
// import geojsonArea from '@mapbox/geojson-area';
import PropTypes from 'prop-types';
// import { Box, Icon } from '@mui/material';
import { useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@mui/styles';
import { MAPBOX_TOKEN } from '~config/environment';
// import HectareasIcon from '~ui/assets/img/hectareas_blanco.svg';
// import CropIcon from '~ui/assets/img/crop_white.svg';
import photoIcon from '~assets/img/photo_home.png';
import { convertGDToUTM } from '~utils/formatCoords';

const useStyles = makeStyles(() =>
  createStyles({
    map: {
      '& .leaflet-left': {
        left: null,
        right: '0px '
      }
    }
  })
);

// eslint-disable-next-line react/prop-types
const RecenterAutomatically = ({lat,lng}) => {
  const map = useMap();
   useEffect(() => {
     map.setView([lat, lng]);
   }, [lat, lng, map]);
   return null;
 };

const ContainerMap = (props) => {

  const { refresh, center, polygon, 
    // onEditPolygon, 
    typeView } = props;
  const [mapCenter, setMapCenter] = useState([0,0]);
  // const [typeView, setTypeView] = useState <'points'| 'coords'>('points');
  // const [count, setCount] = useState(-1);
  // const mapRef = useRef(null);
  const photoIc = L.icon({ iconUrl: photoIcon });
  // const polygonRef = useRef(null);
  const classes = useStyles();

  const {
    auth: { organizationTheme }
  } = useSelector((state) => state);
  // const [mapCenter, setMapCenter] = useState(organizationTheme?.initial_gps);
  
  useEffect(() => {
    // console.log('initial_gps', organizationTheme?.initial_gps);
    setMapCenter(organizationTheme?.initial_gps ?? center ?? [0,0]);
    // setCount(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationTheme, refresh, setMapCenter, center]);


  return (
    <>
      <MapContainer
        // ref={mapRef}
        style={{
          width: '100%',
          height: '380px',
          left: 0,
          top: 0
        }}
        center={{
          lat: (mapCenter && mapCenter[0]) ?? 0, 
          lng: (mapCenter && mapCenter[1]) ?? 0
        }}
        zoom={9}
        class={classes.map}
        maxZoom={22}
        // minZoom={14}
      >
        <RecenterAutomatically lat={(mapCenter && mapCenter[0]) ?? 0} lng={(mapCenter && mapCenter[1]) ?? 0} />
        <TileLayer
          attribution=""
          url={`https://api.mapbox.com/styles/v1/achorres/ckwdkpy1u0hpb14mk2wdlaee5/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`}
        />
   
        <FeatureGroup
        >
          {typeView === 'coords' &&
            polygon &&
            polygon.features.length > 0 &&
            polygon.features.map((element, index) => {
              return element.geometry.coordinates.length > 0 ? (
                <Polygon key={`polygon_${index}`} positions={element.geometry.coordinates} color="#EB7923">
                  <Popup direction="auto">
                    <Box display={'flex'} flexDirection="column" style={{ lineBreak: 'strict' }}>
                      <Box display={'flex'}>
                        <Box fontSize={12} color="#B5B5B5">
                          Productor:&nbsp;
                        </Box>
                        <Box fontSize={12} fontWeight={600}>
                          {element.properties.full_name ?? ''}
                        </Box>
                      </Box>
                      <Box display={'flex'}>
                        <Box fontSize={12} color="#B5B5B5">
                          Unidad productiva:&nbsp;
                        </Box>
                        <Box fontSize={12} fontWeight={600}>
                          {element.properties.name ?? ''}
                        </Box>
                      </Box>
                    </Box>
                  </Popup>
                </Polygon>
              ) : null;
            })}
          {typeView === 'points' &&
            polygon &&
            polygon?.features?.length > 0 &&
            polygon?.features?.map((element, index) => {
              return (
                <Marker
                  key={`key_marker_${index}`}
                  position={element.geometry.coordinates.reverse()}
                  icon={photoIc}
                >
                  <Popup direction="auto">
                    <Box display={'flex'} flexDirection="column" style={{ lineBreak: 'strict' }}>
                      <Box display={'flex'}>
                        <Box fontSize={12} color="#B5B5B5">
                          Productor:&nbsp;
                        </Box>
                        <Box fontSize={12} fontWeight={600}>
                          {element.properties.full_name ?? ''}
                        </Box>
                      </Box>
                      <Box display={'flex'}>
                        <Box fontSize={12} color="#B5B5B5">
                          Unidad productiva:&nbsp;
                        </Box>
                        <Box fontSize={12} fontWeight={600}>
                          {element.properties.name ?? ''}
                        </Box>
                      </Box>
                      <Box>
                        <Box fontSize={12} color="#B5B5B5">
                          Ubicación:&nbsp;
                        </Box>
                        <Box fontSize={12} fontWeight={600}>
                          {convertGDToUTM([element.geometry.coordinates[1], element.geometry.coordinates[0]]) ?? ''}
                        </Box>
                      </Box>
                    </Box>
                  </Popup>
                </Marker>
              );
            })}
        </FeatureGroup>
      
      </MapContainer>
    </>
  );
};
ContainerMap.propTypes = {
  refresh: PropTypes.bool,
  typeView: PropTypes.string,
  center: PropTypes.array,
  polygon: PropTypes.object,
  markers: PropTypes.object,
  onEditPolygon: PropTypes.func
};

export default ContainerMap;
