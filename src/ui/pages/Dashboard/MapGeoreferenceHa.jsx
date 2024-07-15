/* eslint-disable @typescript-eslint/typedef */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Map, TileLayer, Marker, Polygon, FeatureGroup, Tooltip, Popup } from 'react-leaflet';
import { MAPBOX_TOKEN } from '~config/environment';
import { createStyles, makeStyles } from '@mui/styles';
import { EditControl } from 'react-leaflet-draw';
// import * as Leaflet from 'leaflet';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { COMMUNITY_BASE_URL_S3 } from '~config/environment';
import { convertGDToUTM } from '~utils/formatCoords';
import L from 'leaflet';
import photoIcon from '~assets/img/photo_icon_map.png';
import Image from '~molecules/ImageModal/Image';
import { showMessage } from '~utils/Messages';
// import { getAreaFromGeometry } from '~utils/areaFromGeometry';

const useStyles = makeStyles(() =>
  createStyles({
    map: {
      '& .leaflet-left': {
        left: null,
        right: '0px '
      }
    },
    photoHover: {
      '&:hover': {
        transform: 'scale(1.5)'
      }
    },
    iconsHover: {
      img: {
        '&:hover': {
          transform: 'scale(1.5)'
        }
      }
    },
    bigIcon: {
      height: '30px',
      width: '30px'
    },
    classMap: {
      // backgroundColor: 'black',
      display: 'none'
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

const MapGeoreference = (props) => {
  const {
    markers,
    arrObjectsToMap,
    polygons,
    filterSelected,
    center,
    polygonEditMode,
    // addMarker,
    // handleOnAddMarker,
    polygonCancelEdit,
    polygonSaveEdit,
    handleSaveEditedPolygons,
    from
  } = props;
  // const [count, setCount] = useState(-1);
  const mapRef = useRef(null);
  // const map = useMap();
  const classes = useStyles();
  // const limeOptions = { color: 'lime' };
  const photoIc = L.icon({ iconUrl: photoIcon, className: classes.photoHover });
  const bigIcon = L.icon({ iconUrl: photoIcon, className: classes.bigIcon });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editableFG, setEditableFG] = useState(null);
  const [editableControl, setEditableControl] = useState(null);

  const {
    auth: { organizationTheme }
  } = useSelector((state) => state);
  const [mapCenter, setMapCenter] = useState(organizationTheme?.initial_gps);

  const zoomToObject = useCallback(
    (e) => {
      const { lat, lng } = e.latlng;
      if (lat && lng) {
        const point = [lat, lng];
        if (mapRef.current && center.length > 0) {
          const { current = {} } = mapRef;
          const { leafletElement: map } = current;
          if (map.getZoom() < 16) {
            map.flyTo(point, 18, { duration: 2 });
          }
        }
      }
    },
    [center]
  );

  //edit works
  const handleOnEditedDraw = useCallback(
    (e) => {
      try {
        const layers = e?.layers;
        if (layers?.getLayers()?.length === 0) return;
        const arrLayersEdited = layers?.getLayers();
        // console.log(layers?.getLayers());
        arrLayersEdited.forEach((value, index) => {
          if (value instanceof L.Polygon) {
            if (from === 'forms') {
              if (value.options.pathOptions.id) {
                const obj = {
                  id: value.options.pathOptions.id,
                  value: value?.toGeoJSON()
                };
                handleSaveEditedPolygons && handleSaveEditedPolygons(obj);
              }
            } else if (from === 'units') {
              const obj = {
                id: index,
                value: value?.toGeoJSON()
              };
              handleSaveEditedPolygons && handleSaveEditedPolygons(obj);
            }
          }
        });
      } catch (error) {
        showMessage('', 'No se pudo modificar el polígono.', 'error', true);
      }
    },
    [from, handleSaveEditedPolygons]
  );

  const handleOnClickMarker = useCallback((layer) => {
    try {
      // console.log(layer);
      layer.enableEdit();
    } catch (error) {
      showMessage('', 'No se pudo ver el marcador.', 'error', true);
    }
  }, []);

  const handleOnCreated = useCallback(
    (e) => {
      // const type = e.layerType; get type from layer
      // let selectedFeature = null;
      const layer = e.layer;
      // console.log(layer.toGeoJSON());
      layer.bindPopup(`<p>${JSON.stringify(layer.toGeoJSON())}</p>`);
      layer.on('click', (layer) => {
        handleOnClickMarker(layer);
      });
    },
    [handleOnClickMarker]
  );

  const _onFeatureGroupReady = useCallback((reactFGref) => {
    setEditableFG(reactFGref);
  }, []);

  useEffect(() => {
    if (center.length > 0) {
      setMapCenter(center ?? []);
    }
    // setCount(0);
  }, [center, polygons]);

  useEffect(() => {
    // edit active
    if (mapRef.current && polygonEditMode) {
      try {
        if (editableControl) {
          editableControl._toolbars.edit._modes.edit.handler.enable();
        }
        const drawItems = editableFG.leafletElement?._layers ?? [];
        for (const toolbarId in drawItems) {
          const layer = drawItems[toolbarId];
          if (layer instanceof L.Marker) {
            layer.editing.disable();
          }
        }
      } catch (error) {
        showMessage('', 'No se pudo activar la opción de edición.', 'error', true);
      }
    }
  }, [editableControl, editableFG, polygonEditMode]);

  useEffect(() => {
    //cancel edit polygon mode
    if (mapRef.current) {
      try {
        if (editableControl) {
          editableControl._toolbars.edit._modes.edit.handler.revertLayers();
          editableControl._toolbars.edit._modes.edit.handler.disable();
        }
      } catch (error) {
        showMessage('', 'No se pudo cancelar el modo edición del polígono.', 'error', true);
      }
    }
  }, [editableControl, polygonCancelEdit]);

  useEffect(() => {
    //save edit polygon mode
    if (mapRef.current) {
      try {
        if (editableControl) {
          editableControl._toolbars.edit._modes.edit.handler.save();
          editableControl._toolbars.edit._modes.edit.handler.disable();
        }
      } catch (error) {
        showMessage('', 'No se pudo guardar el polígono.', 'error', true);
      }
    }
  }, [editableControl, polygonSaveEdit]);

  const onMountedRect = useCallback(
    (e) => {
      // console.log(e);
      try {
        L.DomUtil.addClass(e._container, classes.classMap);
        // L.DomUtil.addClass(search.getContainer(),'form-control')
        setEditableControl(e);
      } catch (error) {
        showMessage('', 'No se podrá editar el polígono.', 'error', true);
      }
    },
    [classes]
  );

  return (
    <Map
      ref={mapRef}
      zoom={18}
      maxZoom={22}
      style={{
        width: '100%',
        height: '380px',
        left: 0,
        top: 0
      }}
      center={[(mapCenter && mapCenter[0]) ?? 0, (mapCenter && mapCenter[1]) ?? 0]}
      class={classes.map}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
    >
      <RecenterAutomatically lat={(mapCenter && mapCenter[0]) ?? 0} lng={(mapCenter && mapCenter[1]) ?? 0} />
      <TileLayer
        attribution=""
        url={`https://api.mapbox.com/styles/v1/achorres/ckwdkpy1u0hpb14mk2wdlaee5/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`}
      />
      <FeatureGroup
        ref={(reactFGref) => {
          _onFeatureGroupReady(reactFGref);
        }}
      >
        <EditControl
          onMounted={onMountedRect}
          position="topright"
          // ref={editControl.ref || ((e) => {})}
          // onCreated={editControl.onCreated || ((e) => {})}
          onCreated={handleOnCreated}
          onEdited={handleOnEditedDraw}
          // onDeleted={handleOnDeleteDraw}
          className={classes.classMap}
          draw={{
            circle: false,
            rectangle: false,
            polyline: false,
            polygon: false,
            marker: false,
            circlemarker: false
          }}
          edit={{
            remove: false,
            edit: true
          }}
        />
        {filterSelected === '1' &&
          markers &&
          markers?.length > 0 &&
          markers?.map((element, index) => {
            return (
              <Marker
                onclick={handleOnClickMarker}
                riseOnHover={true}
                key={`key_marker_${index}`}
                position={element.position}
                editable={false}
              >
                <Tooltip direction="top">
                  <Box display={'flex'} style={{ lineBreak: 'strict' }}>
                    <p style={{ lineBreak: 'strict' }}>{element.name}</p>
                  </Box>
                </Tooltip>
              </Marker>
            );
          })}

        {filterSelected === '2' &&
          polygons &&
          polygons.features.length > 0 &&
          polygons.features.map((element, index) => {
            return element.geometry.coordinates.length > 0 ? (
              <Polygon
                key={`polygon_${index}`}
                pathOptions={{ color: 'lime', id: element.properties.id }}
                positions={element.geometry.coordinates}
              >
                <Popup direction="auto">
                  {/* {element.properties && element.properties.name && (
                    <Box display={'flex'} style={{ lineBreak: 'strict' }}>
                      {`${element.properties.name}`}
                    </Box>
                  )} */}
                  <Box display={'flex'} style={{ lineBreak: 'strict' }}>
                    Área total calculada:
                  </Box>
                  {element.properties && element.properties.area && (
                    <Box display={'flex'} style={{ lineBreak: 'strict' }}>
                      {`${element.properties.area}`} ha
                    </Box>
                  )}
                </Popup>
              </Polygon>
            ) : null;
          })}
        {filterSelected === '2' &&
          arrObjectsToMap &&
          arrObjectsToMap?.length > 0 &&
          arrObjectsToMap?.map((element, index) => {
            return (
              <Marker
                key={`key_marker_object_${index}`}
                editable={false}
                position={element.position}
                icon={photoIc}
                onclick={(e) => zoomToObject(e)}
                onmouseover={(e) => e.target.setIcon(bigIcon)}
                onmouseout={(e) => e.target.setIcon(photoIc)}
              >
                <Popup direction="auto">
                  <Box display={'flex'} flexDirection="column" style={{ lineBreak: 'strict' }}>
                    {element.image && (
                      <Image image={`${COMMUNITY_BASE_URL_S3}${element.image}`} />
                      // <img
                      //   src={`${COMMUNITY_BASE_URL_S3}${element.image}`}
                      //   style={{ height: '150px', objectFit: 'cover', top: 0 }}
                      // />
                    )}
                    <Box fontSize={13} fontWeight={600} mt={1}>
                      {(element?.name ?? '').toUpperCase()}
                    </Box>
                    <Box fontSize={13} color="#B5B5B5">
                      {convertGDToUTM([element.position[1], element.position[0]]) ?? ''}
                    </Box>
                  </Box>
                </Popup>
              </Marker>
            );
          })}
      </FeatureGroup>
    </Map>
  );
};

MapGeoreference.propTypes = {
  markers: PropTypes.array,
  arrObjectsToMap: PropTypes.array,
  polygons: PropTypes.object,
  filterSelected: PropTypes.string,
  center: PropTypes.array,
  // addMarker: PropTypes.bool,
  // handleOnAddMarker: PropTypes.func,
  polygonEditMode: PropTypes.bool,
  refresh: PropTypes.bool,
  polygonCancelEdit: PropTypes.bool,
  polygonSaveEdit: PropTypes.bool,
  handleSaveEditedPolygons: PropTypes.func,
  from: PropTypes.string //units - forms
};

export default MapGeoreference;
