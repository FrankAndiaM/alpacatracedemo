/* eslint-disable @typescript-eslint/typedef */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Map, TileLayer, FeatureGroup, Rectangle, CircleMarker } from 'react-leaflet';
// import { EditControl } from 'react-leaflet-draw';
// import { showMessage } from '~utils/Messages';
import L from 'leaflet';
// import geojsonArea from '@mapbox/geojson-area';
import PropTypes from 'prop-types';
// import { Box, Icon } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { MAPBOX_TOKEN } from '~config/environment';
// import HectareasIcon from '~ui/assets/img/hectareas_blanco.svg';
// import CropIcon from '~ui/assets/img/crop_white.svg';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(() =>
  createStyles({
    map: {
      '& .leaflet-left': {
        left: null,
        right: '0px '
      },
      '& :hover': {
        cursor: 'default'
      }
    }
  })
);

// eslint-disable-next-line react/prop-types, @typescript-eslint/no-unused-vars
const RecenterAutomatically = ({ lat, lng }) => {
  // const map = useMap();
  // useEffect(() => {
  //   map.setView([lat, lng]);
  // }, [lat, lng, map]);
  return null;
};

const ContainerMap = (props) => {
  const {
    zoomMap,
    center,
    // onSelectMap,
    editDraw,
    rectangle
    // handleOpenAlert
  } = props;
  const {
    auth: { organizationTheme }
  } = useSelector((state) => state);
  const [mapCenter, setMapCenter] = useState(organizationTheme?.initial_gps);
  const mapRef = useRef(null);
  const classes = useStyles();
  // const [editableFG, setEditableFG] = useState(null);

  useEffect(() => {
    if (rectangle) {
      try {
        const { x, y } = L.bounds(rectangle).getCenter();
        setMapCenter([x, y] ?? []);
      } catch (error) {
        setMapCenter(center ?? []);
      }
      // console.log(L.bounds(rectangle).getCenter());
    } else {
      if (mapRef.current && center.length > 0) {
        const { current = {} } = mapRef;
        const { leafletElement: map } = current;
        map.flyTo(center, zoomMap, { duration: 3 });
        // console.log(mapRef.current);
        // setMapCenter(center ?? []);
      }
    }
  }, [center, rectangle, zoomMap]);

  // useEffect(() => {
  //   console.log('panmn!');
  //   if (mapRef.current) {
  //     const { current = {} } = mapRef;
  //     const { leafletElement: map } = current;
  //     map.flyTo(center, 14, { duration: 2 });
  //     // console.log(mapRef.current);
  //   }
  // }, [center, handleChangeMapCenter]);

  // const handleOnEditedDraw = useCallback(() => {
  // try {
  //   const layers = e?.layers;
  //   if (layers?.getLayers()?.length === 0) return;
  //   const feature = layers?.getLayers()[0];
  //   const { lat, lng } = feature?.getBounds().getCenter();
  //   const geoJSON = feature?.toGeoJSON();
  //   // onEditPolygon(geoJSON, [lat, lng]);
  //   // setArea(L.GeometryUtil.geodesicArea(feature.getLatLngs()[0]) / 10000);
  //   // setMapCenter([lat, lng]);
  //   // setFeatureCoordinates(coordinates);
  // } catch (error) {
  //   showMessage('', 'No se pudo modificar el polígono.', 'error', true);
  // }
  // }, []);

  // const handleOnDeleteDraw = useCallback((e) => {
  //   // eslint-disable-next-line no-console
  //   console.log(e);

  //   // const features = this.state.features;
  //   // e.layers.eachLayer(layer => {
  //   //   const indexLeaflet = layer._leaflet_id;
  //   //   const index = String('l'.concat(indexLeaflet));
  //   //   delete features[index];
  //   // })
  //   // this.setState({features});
  //   // const objFeatures = Object.keys(features);
  //   // if (objFeatures.length < 1) {
  //   //   await this.setState({editControlOptions:{}});
  //     this.setState({createdLote: false, editControlOptions:{draw:{polygon:true},edit:{edit:false, remove:false}}})
  //   // };
  // }, []);

  const _onFeatureGroupReady = useCallback((reactFGref) => {
    // setEditableFG(reactFGref);

    if (reactFGref?.leafletElement !== undefined) {
      const leafletFG = reactFGref.leafletElement;
      leafletFG.clearLayers();
    }
  }, []);

  // const handleOnCreated = useCallback(
  //   (e) => {
  //     // const type = e.layerType;
  //     const layer = e.layer;
  //     let valid = true;
  //     try {
  //       const areaKM = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]) / 1000000;
  //       // if (areaKM > 1114.4) {
  //       if (areaKM > 100) {
  //         valid = false;
  //       }
  //     } catch (error) {
  //       // eslint-disable-next-line no-console
  //       console.log(error);
  //     }
  //     if (!valid) {
  //       editableFG.leafletElement.removeLayer(layer);
  //       handleOpenAlert();
  //       return;
  //     }
  //     const drawnItems = editableFG.leafletElement._layers;
  //     // if the number of layers is bigger than 1 then delete the first
  //     if (Object.keys(drawnItems).length > 1) {
  //       Object.keys(drawnItems).forEach((layerid, index) => {
  //         if (index > 0) return;
  //         const layer = drawnItems[layerid];
  //         editableFG.leafletElement.removeLayer(layer);
  //       });
  //       // console.log(drawnItems[0]);
  //     }
  //     onSelectMap(layer._bounds);
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [editableFG]
  // );

  return (
    <>
      <Map
        ref={mapRef}
        style={{
          width: '100%',
          height: '450px',
          left: 0,
          top: 0
        }}
        center={[(mapCenter && mapCenter[0]) ?? 0, (mapCenter && mapCenter[1]) ?? 0]}
        zoom={!editDraw ? zoomMap : 14}
        class={classes.map}
        maxZoom={22}
        // onclick={handleClick}
        // onmousemove={handleMouseOver}
        // minZoom={14}
      >
        <RecenterAutomatically lat={(mapCenter && mapCenter[0]) ?? 0} lng={(mapCenter && mapCenter[1]) ?? 0} />
        <TileLayer
          attribution=""
          url={`https://api.mapbox.com/styles/v1/achorres/ckwdkpy1u0hpb14mk2wdlaee5/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`}
        />
        {/* <WMSTileLayer
          transparent={true}
          dpi={96}
          url="https://georural.minagri.gob.pe/geoservicios/services/public/PSAD56_Catastro_Rural/MapServer/WMSServer"
          format="image/png"
          layers="9"
        /> */}
        <FeatureGroup
          ref={(reactFGref) => {
            _onFeatureGroupReady(reactFGref);
          }}
        >
          {/* <EditControl
            position="topright"
            // ref={editControl.ref || ((e) => {})}
            // onCreated={editControl.onCreated || ((e) => {})}
            onCreated={handleOnCreated}
            // onEdited={handleOnEditedDraw}
            // onDeleted={handleOnDeleteDraw}
            draw={
              !editDraw
                ? {
                    circle: false,
                    rectangle: {
                      shapeOptions: {
                        color: '#04C100'
                      },
                      repeatMode: true
                    },
                    polyline: false,
                    polygon: false,
                    marker: false,
                    circlemarker: false
                  }
                : {
                    circle: false,
                    rectangle: false,
                    polyline: false,
                    polygon: false,
                    marker: false,
                    circlemarker: false
                  }
            }
            // rectangleOptions={{
            //   repeatMode: true
            // }}
            edit={{
              remove: false,
              edit: false
            }}
          /> */}
        </FeatureGroup>
        {rectangle && <Rectangle bounds={rectangle} color="#EBBF3F" fillOpacity={0.5} fillColor={'white'} />}
        {rectangle &&
          Array.isArray(rectangle) &&
          rectangle.map((element, index) => {
            return (
              <CircleMarker
                key={`circle_${index}`}
                center={element}
                color="#EBBF3F"
                fillOpacity={1}
                fillColor="white"
                radius={8}
                opacity={1}
              />
            );
          })}
        {/* {polygon !== undefined && (
          <Box
            position="absolute"
            zIndex={999}
            bottom={0}
            left={0}
            color="white"
            borderRadius="5px"
            margin="5px"
            padding="7px"
            style={{
              background: '#928E8C'
            }}>
            <Box display="flex" alignItems="center" p="5px">
              <Icon style={{ marginRight: '3px' }}>room</Icon>
            </Box>
            <Box display="flex" alignItems="center" p="5px">
              <img src={HectareasIcon} alt="hectareas" style={{ marginRight: '5px' }} />
            </Box>
            <Box display="flex" alignItems="center" p="5px">
              <img src={CropIcon} alt="cultivos" style={{ marginRight: '5px' }} />
            </Box>
          </Box>
        )} */}
      </Map>
    </>
  );
};
ContainerMap.propTypes = {
  center: PropTypes.array,
  zoomMap: PropTypes.number,
  onSelectMap: PropTypes.func,
  editDraw: PropTypes.bool,
  rectangle: PropTypes.array,
  handleOpenAlert: PropTypes.func
};

export default React.memo(ContainerMap);
