import React, { useCallback, useEffect, useState } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
// import { showMessage } from '~utils/Messages';
import Button from '~atoms/Button/Button';
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  // FormControl,
  Grid,
  // MenuItem,
  //   Paper,
  // Select,
  Tooltip,
  Typography
} from '@mui/material';
// import { updateGatherFormData } from '~services/organization/formsv2';
// import { useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
// import { markerProps } from './MapGeoreference';
// import { getAreaFromGeometry, getCenterFromGeoJson } from '~utils/areaFromGeometry';
// import MapIcon from '@mui/icons-material/Map';
import FormDataType from './FormDataType';
import { OrganizationFormAttribute } from '~models/organizationFormAttribute';
// import { convertGDToUTM } from '~utils/formatCoords';
// import { Icon as Iconify } from '@iconify/react';
// import ShowMapSection from '../DataOrganizationForm/showMapSection';
// import ExcelIcon from '@iconify/icons-vscode-icons/file-type-excel';
// import ActionsMenu from '~ui/molecules/ActionsMenu';
// import { COMMUNITY_BASE_URL_S3 } from '~config/environment';

type FormDialogProps = {
  onClose(): void;
  selectedFormDataValue: any;
};

const FORM_STATUS: any = {
  COMPLETED: {
    display_name: 'Completo',
    color: 'rgba(235, 248, 224, 1)'
  },
  PENDING: {
    display_name: 'Pendiente',
    color: '#FFC107'
  },
  UNFINISHED: {
    display_name: 'Incompleto',
    color: '#D84D44'
  }
};

const useStyles: any = makeStyles(() => ({
  scrollBarClass: {
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    /* Track */
    '&::-webkit-scrollbar-track': {
      background: '#ffffff'
    },

    /* Handle */
    '&::-webkit-scrollbar-thumb': {
      background: '#D9D9D9',
      borderRadius: '13px'
    },

    /* Handle on hover */
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#888'
    }
  }
}));

type FormGeoKeys = {
  id: string;
  name: string;
  type: string;
  display_name: string;
};

const FormDialog: React.FC<FormDialogProps> = (props: FormDialogProps) => {
  const classes = useStyles();
  // const {
  //   auth: { organizationTheme }
  // }: any = useSelector((state: any) => state);

  let position: number = 0;
  const { onClose, selectedFormDataValue } = props;
  const [isLoadingFormData] = useState<boolean>(false);
  const [entryEntityType] = useState<string>(selectedFormDataValue?.gather_form?.entry_entity_type ?? '');
  //   const [selectedFormDataValue, setSelectedFormDataValue] = useState<any | undefined>(undefined);
  // const [hasGeo, setHasGeo] = useState(false);
  // const [viewMap, setViewMap] = useState(false);
  // const [arrMarkers, setArrMarkers] = useState<Array<any>>([]);
  // const [arrObjectsToMap, setArrObjectsToMap] = useState<Array<any>>([]);
  // const [featurePolygons, setFeaturePolygons] = useState<any | undefined>(undefined);
  // const [keysGeoForm, setKeysGeoForm] = useState<Array<FormGeoKeys>>([]);
  // const [mapCenterMarkers, setMapCenterMarkers] = useState<any[]>(organizationTheme?.initial_gps);
  // const [mapCenterPolygons, setMapCenterPolygons] = useState<any[]>(organizationTheme?.initial_gps);
  //   const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [selectFormatCoords, setSelectFormatCoords] = useState<number>(0);
  // const [isSavingChanges, setIsSavingChanges] = useState<boolean>(false);
  // const [isDownloadFileLoading, setIsDownloadFileLoading] = useState<boolean>(false);

  // const itemsCoordsFormats = [
  //   { id: 0, description: 'UTM-WSG84', name: 'UTM-WSG84' },
  //   { id: 1, description: 'GD-WSG84', name: 'GD-WSG84' }
  // ];
  // const handleOnChangeFormType = useCallback(
  //   (name: any, value: any) => {
  //     formik.setFieldValue(name, value);
  //   },
  //   [formik]
  // );
  const loadOrganizationForm = useCallback(() => {
    const schemaAttr = selectedFormDataValue?.gather_form?.schema?.data;
    // eslint-disable-next-line no-var
    var arrLoc: Array<any> = [];
    // console.log(organization_form_attributes);
    if (schemaAttr) {
      schemaAttr.forEach((obj: any) => {
        if (
          obj.attribute_type === 'georeference' ||
          obj.attribute_type === 'gps_point' ||
          obj.attribute_type === 'photo'
        ) {
          const objDev: FormGeoKeys = {
            id: obj.id,
            name: obj.name,
            type: obj.attribute_type,
            display_name: obj.display_name
          };
          arrLoc.push(objDev);
        }
      });
    }
    // console.log(arrLoc);
    // if (arrLoc.length > 0) {
    //   setKeysGeoForm(arrLoc);
    //   // setHasGeo(true);
    // }
    // setOrganizationForm(selectedFormDataValue);
  }, [selectedFormDataValue]);

  // const formatCoordinates = useCallback((attribute_type: OrganizationFormAttributeType, points: any) => {
  //   if (attribute_type === 'georeference') {
  //     const poslet = points;
  //     if (poslet) {
  //       const arrCoords = poslet.split(',');
  //       let geoString = '';
  //       arrCoords.forEach((coord: any) => {
  //         const poslet = coord.trim();
  //         const arrMark = poslet.split(' ');
  //         if (Number(arrMark[0]) && Number(arrMark[1])) {
  //           geoString += convertGDToUTM(arrMark) + ', ';
  //         }
  //       });
  //       return geoString;
  //     }
  //   }
  //   if (attribute_type === 'gps_point') {
  //     const poslet = points;
  //     if (poslet) {
  //       const arrMark = poslet.split(' ');
  //       if (Number(arrMark[0]) && Number(arrMark[1])) {
  //         return convertGDToUTM(arrMark);
  //       }
  //     }
  //   }

  //   return points;

  //   // setIsDataLoading(false);
  // }, []);

  // const handleChangeFormat2 = useCallback((e: any) => {
  //   setSelectFormatCoords(Number(e.target.value));
  // }, []);

  // const handleViewMap = useCallback(() => {
  //   const arrMarkersLocal: Array<markerProps> = [];
  //   const arrPolygonsLocal: Array<any> = [];
  //   const arrObjectsToPolygonsLocal: Array<any> = [];

  //   let centerLoadedMarkers = false;
  //   let centerLoadedPolygons = false;
  //   // console.log(keysGeoForm);
  //   keysGeoForm.forEach((element: FormGeoKeys) => {
  //     let evalType = '';
  //     let poslet = '';
  //     try {
  //       evalType = selectedFormDataValue.data[element.id];
  //     } catch (error) {
  //       return;
  //     }
  //     if (typeof evalType === 'string') {
  //       poslet = selectedFormDataValue.data[element.id];
  //     }
  //     if (typeof evalType === 'object') {
  //       poslet = selectedFormDataValue.data[element.id].gps;
  //     }

  //     if (!poslet) return;

  //     if (element.type === 'georeference') {
  //       //es un polígono
  //       const arrPolygon = poslet.split(',');
  //       const polyLocal: Array<any> = [];
  //       const polygonToCalculate: Array<any> = [];
  //       arrPolygon.forEach((element: any) => {
  //         const poslet = element.trim();
  //         const arrMark = poslet.split(' ');
  //         if (Number(arrMark[0]) && Number(arrMark[1])) {
  //           if (!centerLoadedPolygons) {
  //             const point = [parseFloat(arrMark[1]), parseFloat(arrMark[0])];
  //             // setMapCenterPolygons(point);
  //             centerLoadedPolygons = true;
  //           }
  //           polyLocal.push([parseFloat(arrMark[1]), parseFloat(arrMark[0])]);
  //           polygonToCalculate.push([parseFloat(arrMark[0]), parseFloat(arrMark[1])]);
  //         }
  //       });

  //       const geoJsonToCalculate = {
  //         coordinates: [polygonToCalculate],
  //         type: 'Polygon'
  //       };
  //       //armar geojson
  //       const prevgeometry = {
  //         coordinates: [polyLocal],
  //         type: 'Polygon'
  //       };
  //       const areaM = getAreaFromGeometry(geoJsonToCalculate);
  //       const geoJson: any = {
  //         type: 'Feature',
  //         geometry: prevgeometry,
  //         properties: {
  //           name: 'nameee, here',
  //           area: areaM,
  //           id: element.id
  //         }
  //       };
  //       arrPolygonsLocal.push(geoJson);
  //     }
  //     if (element.type === 'gps_point') {
  //       //es un punto
  //       const poslet = selectedFormDataValue.data[element.id];
  //       const arrMark = poslet.split(' ');
  //       if (Number(arrMark[0]) && Number(arrMark[1])) {
  //         if (!centerLoadedMarkers) {
  //           const point = [parseFloat(arrMark[1]), parseFloat(arrMark[0])];
  //           setMapCenterMarkers(point);
  //           centerLoadedMarkers = true;
  //         }
  //         const obj: markerProps = {
  //           name: element.name,
  //           position: [parseFloat(arrMark[1]), parseFloat(arrMark[0])]
  //         };
  //         arrMarkersLocal.push(obj);
  //       }
  //     }
  //     if (element.type === 'photo') {
  //       //es una imagen georeferenciada
  //       // console.log('foto', selectedFormDataValue.data[element.id]);
  //       const poslet = selectedFormDataValue.data[element.id].gps;
  //       const arrMark = poslet.split(' ');
  //       if (Number(arrMark[0]) && Number(arrMark[1])) {
  //         if (!centerLoadedPolygons) {
  //           const point = [parseFloat(arrMark[1]), parseFloat(arrMark[0])];
  //           setMapCenterPolygons(point);
  //           centerLoadedPolygons = true;
  //         }
  //         const obj: any = {
  //           name: element.name,
  //           display_name: element.display_name,
  //           image: selectedFormDataValue.data[element.id].image ?? '',
  //           position: [parseFloat(arrMark[1]), parseFloat(arrMark[0])]
  //         };
  //         arrObjectsToPolygonsLocal.push(obj);
  //         //   // arrMarkersLocal.push(obj);
  //       }
  //     }
  //   });

  //   const featureCollection = {
  //     type: 'FeatureCollection',
  //     features: arrPolygonsLocal
  //   };

  //   //Si hay poligonos, obtiene el punto central del primer poligono en el arreglo
  //   if (featureCollection.features.length > 0) {
  //     const pointCenter = getCenterFromGeoJson(featureCollection.features[0]);
  //     if (pointCenter) {
  //       setMapCenterPolygons(pointCenter);
  //     }
  //   }

  //   setArrMarkers(arrMarkersLocal);
  //   setFeaturePolygons(featureCollection);
  //   setArrObjectsToMap(arrObjectsToPolygonsLocal);

  //   if (selectedFormDataValue && selectedFormDataValue.id !== undefined) {
  //     setViewMap(true);
  //   }
  // }, [keysGeoForm, selectedFormDataValue]);

  // const saveAs = useCallback(
  //   (url: string) => {
  //     const link = document.createElement('a');
  //     document.body.appendChild(link);
  //     link.target = '_blank';
  //     link.rel = 'noopener noreferrer';
  //     link.download = 'download';
  //     link.href = url;
  //     link.download = selectedFormDataValue?.gather_form?.name
  //       ? `${selectedFormDataValue?.gather_form?.name}.xlsx`
  //       : 'archivo.xlsx';
  //     link.click();
  //     document.body.removeChild(link);
  //   },
  //   [selectedFormDataValue]
  // );

  // const handleOnDownloadRequest = useCallback(
  //   (coordsSystemTyp: 'UTM-WSG84' | 'GD-WSG84') => {
  //     setIsDownloadFileLoading(true);
  //     downloadGatherFormData(selectedFormDataValue?.gather_form?.id ?? '', {
  //       action: 'generate',
  //       gather_form_id: selectedFormDataValue?.gather_form?.id ?? '',
  //       coordinate_system: coordsSystemTyp,
  //       owner_model_id: organizationTheme?.organizationId ?? '',
  //       owner_mode_type: 'Organizations'
  //     })
  //       .then((res: any) => {
  //         const data = res?.data;

  //         switch (data?.file_status) {
  //           case 'completed':
  //             setIsDownloadFileLoading(false);
  //             saveAs(COMMUNITY_BASE_URL_S3 + data?.file_path);
  //             break;
  //           case 'processing':
  //             const interval = setInterval(() => {
  //               downloadGatherFormData(selectedFormDataValue?.gather_form?.id ?? '', {
  //                 action: 'get_result',
  //                 gather_form_id: selectedFormDataValue?.gather_form?.id ?? '',
  //                 owner_model_id: organizationTheme?.organizationId ?? '',
  //                 owner_mode_type: 'Organizations'
  //               })
  //                 .then((res: any) => {
  //                   const data = res?.data;

  //                   switch (data?.file_status) {
  //                     case 'processing':
  //                       break;
  //                     case 'completed':
  //                       setIsDownloadFileLoading(false);
  //                       clearInterval(interval);
  //                       saveAs(COMMUNITY_BASE_URL_S3 + data?.file_path);
  //                       break;
  //                     default:
  //                       setIsDownloadFileLoading(false);
  //                       clearInterval(interval);
  //                       showMessage('', 'Problemas al descargar el archivo.', 'error', true);
  //                       break;
  //                   }
  //                 })
  //                 .catch((err: any) => {
  //                   setIsDownloadFileLoading(false);
  //                   clearInterval(interval);
  //                   const data = err?.response?.data;

  //                   if (data?.hasOwnProperty('message')) {
  //                     showMessage('', data?.message ?? '', 'error', true);
  //                     return;
  //                   }
  //                   showMessage('', 'Problemas al descargar el archivo.', 'error', true);
  //                 });
  //             }, 2000);
  //             return;
  //           default:
  //             setIsDownloadFileLoading(false);

  //             showMessage('', 'Problemas al descargar el archivo.', 'error', true);
  //             break;
  //         }
  //       })
  //       .catch((err: any) => {
  //         setIsDownloadFileLoading(false);
  //         const data = err?.response?.data;
  //         if (data?.hasOwnProperty('message')) {
  //           showMessage('', data?.message ?? '', 'error', true);
  //           return;
  //         }
  //         showMessage('', 'Problemas al descargar el archivo.', 'error', true);
  //       });
  //   },
  //   [organizationTheme, saveAs, selectedFormDataValue]
  // );

  const renderFarmBox = (row: any) => {
    if (row?.hasOwnProperty('farm') && row?.farm !== undefined && row?.farm !== null) {
      return (
        <Box
          sx={{
            fontWeight: 400,
            fontSize: '14px',
            backgroundColor: '#F4F6F8',
            marginBlock: '12px',
            padding: '16px'
          }}
        >
          <Typography fontWeight={600} fontSize={14} mb={2}>
            Unidad Productiva
          </Typography>
          <FormDataType type="string" attribute={row?.farm?.name || ''} />
        </Box>
      );
    }
    if (row?.hasOwnProperty('data')) {
      if (row?.data?.hasOwnProperty('productive_unit_name')) {
        return (
          <Box
            sx={{
              fontWeight: 400,
              fontSize: '14px',
              backgroundColor: '#F4F6F8',
              marginBlock: '12px',
              padding: '16px'
            }}
          >
            <Typography fontWeight={600} fontSize={14} mb={2}>
              Unidad Productiva
            </Typography>
            <FormDataType type="string" attribute={row?.data['productive_unit_name'] || ''} />
          </Box>
        );
      }
    }
    return <></>;
  };

  // const handleBackViewMap = useCallback(() => {
  //   setViewMap(false);
  //   // setSelectedFormDataValue(Object.assign({}, {}));
  // }, []);

  // const getStrLatLngFromGeoJson = useCallback((value: any): string => {
  //   const { geometry } = value;
  //   if (geometry && geometry.type === 'Polygon') {
  //     const arrCoordinates: any[] = geometry.coordinates[0];
  //     let strCoordinates = '';
  //     let arr: any[] = [];
  //     if (Array.isArray(arrCoordinates) && arrCoordinates.length > 0) {
  //       arr = arrCoordinates.map((value: any[]) => {
  //         return value.join(' ');
  //       });
  //     }
  //     if (arr.length > 0) {
  //       strCoordinates = arr.toString();
  //       return strCoordinates;
  //     }
  //   }
  //   return '';
  // }, []);

  // const _updateFormData = useCallback((organizationFormId: any, id: any, data: any) => {
  //   return updateGatherFormData(organizationFormId, id, data);
  // }, []);

  // const saveChangesPolygons = useCallback(
  //   (editedPolygons: any[]) => {
  //     // console.log(selectedFormDataValue.data);
  //     // console.log(editedPolygons);
  //     const data = Object.assign({}, selectedFormDataValue.data);
  //     if (editedPolygons.length > 0) {
  //       editedPolygons.forEach((element: any) => {
  //         const str = getStrLatLngFromGeoJson(element.value);
  //         if (str !== '') {
  //           data[element.id] = str;
  //         }
  //       });
  //     } else {
  //       showMessage('', 'No se encontraron polígonos por editar.', 'info', false);
  //     }
  //     // console.log(data);
  //     setIsSavingChanges(true);
  //     _updateFormData(selectedFormDataValue?.gather_form?.id ?? '', selectedFormDataValue.id, { data })
  //       .then((_resp: any) => {
  //         // console.log(resp);
  //         setIsSavingChanges(false);
  //         showMessage('', 'Los polígonos se editaron correctamente.', 'success', false);
  //         setViewMap(false);
  //         //   loadDataRowSelected(rowSelected);
  //       })
  //       .catch((_error: any) => {
  //         setIsSavingChanges(false);
  //         showMessage('', 'Error al editar los polígonos.', 'error', true);
  //         // console.log(error);
  //       });

  //     // console.log(data);
  //   },
  //   [getStrLatLngFromGeoJson, selectedFormDataValue, _updateFormData]
  // );

  useEffect(() => {
    loadOrganizationForm();
  }, [loadOrganizationForm]);

  return (
    <>
      <Dialog
        open
        title="Respuesta de formulario"
        subtitle=""
        onClose={() => onClose()}
        actions={
          <>
            <Button onClick={() => onClose()} sx={{ width: '150px' }} variant="contained" text="Cerrar" />
            {/* <Button
            onClick={() => onSubmit()}
            color="primary"
            variant="contained"
            disabled={formik.isSubmitting}
            isLoading={formik.isSubmitting}
            text="Registrar"
          /> */}
          </>
        }
      >
        <Grid container={true}>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            {/* <Paper className={classes.scrollBarClass} elevation={3} sx={{ padding: '20px', height: '58vh' }}> */}
            <Box className={classes.scrollBarClass} sx={{ padding: '20px', height: '58vh' }}>
              {!isLoadingFormData ? (
                <>
                  {selectedFormDataValue ? (
                    <>
                      <Box
                        color={'#637381'}
                        fontWeight={700}
                        fontSize={13}
                        mb={2}
                        display={'flex'}
                        justifyContent={'space-between'}
                      >
                        <Box display={'flex'} flexDirection={'column'}>
                          <Box mb={2}>
                            <Typography component={'span'} color={'#0F1419'} fontWeight={700} fontSize={13}>
                              Usuario:&nbsp;
                            </Typography>
                            {selectedFormDataValue?.agro_leader?.full_name?.toUpperCase() || ''}
                          </Box>
                          <Box>
                            <Typography component={'span'} color={'#0F1419'} fontWeight={700} fontSize={13}>
                              Fecha:&nbsp;
                            </Typography>
                            {format(new Date(selectedFormDataValue?.created_at), 'dd MMM yyyy', {
                              locale: es
                            }).toUpperCase()}
                          </Box>
                        </Box>

                        <Box>
                          {/* <Typography component={'span'} color={'#0F1419'} fontWeight={700} fontSize={13}>
                            ESTADO:&nbsp;
                          </Typography> */}
                          <Chip
                            label={
                              FORM_STATUS[selectedFormDataValue?.form_fill_status ?? 'COMPLETED'].display_name ??
                              'COMPLETED'
                            }
                            sx={{
                              backgroundColor:
                                FORM_STATUS[selectedFormDataValue?.form_fill_status].color ?? 'rgba(235, 248, 224, 1)',
                              color: 'rgba(0, 171, 85, 1)',
                              borderRadius: '22px'
                            }}
                          />
                        </Box>
                      </Box>
                      <Box display={'flex'} flexDirection={'column'} color={'#637381'} fontWeight={700} fontSize={13}>
                        {entryEntityType !== 'FREE' && (
                          <Box mb={2}>
                            <Typography component={'span'} color={'#0F1419'} fontWeight={700} fontSize={13}>
                              PRODUCTOR:&nbsp;
                            </Typography>
                            {entryEntityType === 'PRODUCER'
                              ? (selectedFormDataValue?.farmer?.full_name ?? '').toUpperCase()
                              : (selectedFormDataValue?.farmer?.producer?.full_name ?? '').toUpperCase()}
                          </Box>
                        )}
                        {/* {hasGeo && (
                          <Box display={'flex'} alignItems={'center'} mb={2}>
                            <Typography component={'span'} color={'#0F1419'} fontWeight={700} fontSize={13}>
                              SISTEMA DE COORDENADAS:
                            </Typography>
                            <FormControl variant="standard" sx={{ minWidth: 120, marginLeft: '8px' }}>
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={selectFormatCoords}
                                onChange={handleChangeFormat2}
                                sx={{ color: '#2A945F' }}
                              >
                                {itemsCoordsFormats.map((element: any, index: number) => (
                                  <MenuItem key={`value_${index}`} value={element.id}>
                                    {element.description}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        )} */}
                      </Box>
                      {/* <Box display="flex">
                        {hasGeo && (
                          <Button
                            text="Ver en mapa"
                            variant="contained"
                            onClick={handleViewMap}
                            disabled={selectedFormDataValue?.id === undefined}
                            sx={{
                              backgroundColor: '#FFC107',
                              color: '#000000',
                              padding: '5px',
                              boxShadow: 0,
                              width: '189px',
                              '&:hover': {
                                backgroundColor: '#FFC107'
                              }
                            }}
                            startIcon={<MapIcon />}
                          />
                        )}
                        <ActionsMenu
                          disabled={isDownloadFileLoading}
                          button={
                            <Button
                              variant="contained"
                              startIcon={<Iconify icon={ExcelIcon} />}
                              text="Descargar Excel"
                              disabled={isDownloadFileLoading}
                              isLoading={isDownloadFileLoading}
                            />
                          }
                          listItems={[
                            {
                              onClick: () => handleOnDownloadRequest('UTM-WSG84'),
                              icon: '',
                              text: 'Coordenadas UTM-WSG84'
                            },
                            {
                              onClick: () => handleOnDownloadRequest('GD-WSG84'),
                              icon: '',
                              text: 'Coordenadas GD-WSG84'
                            }
                          ]}
                        />
                      </Box> */}
                      <Divider />
                      {/* box categoría */}
                      {renderFarmBox(selectedFormDataValue)}
                      {selectedFormDataValue?.gather_form?.schema?.data?.map(
                        (value: OrganizationFormAttribute, idx: number) => {
                          if (value.attribute_type !== 'title') {
                            position++;
                          }
                          if (selectedFormDataValue?.hasOwnProperty('data')) {
                            if (value?.id !== undefined && selectedFormDataValue?.data?.hasOwnProperty(value?.id)) {
                              if (value.attribute_type === 'title') {
                                return (
                                  <Box key={`box_attr_${idx}`} bgcolor={'red'}>
                                    {value.name}
                                  </Box>
                                );
                              }
                              if (value.attribute_type === 'conditional') {
                                let finds = null;
                                let responses = '';
                                const idResp = selectedFormDataValue?.data[value?.id];
                                if (value.schemas && value.schemas?.length > 0 && idResp?.id) {
                                  finds = value.schemas.find((e: any) => e.id === idResp?.id);
                                  if (finds && finds.schemas && Array.isArray(finds.schemas)) {
                                    responses = finds.schemas.map((element: any, idx: number) => {
                                      return (
                                        <>
                                          <Box
                                            sx={{
                                              fontWeight: 400,
                                              fontSize: '14px',
                                              backgroundColor: '#F4F6F8',
                                              marginBlock: '12px',
                                              padding: '16px',
                                              marginLeft: '32px'
                                            }}
                                          >
                                            <Typography fontWeight={600} fontSize={14} mb={2}>
                                              <Tooltip title={value.description ?? ''} arrow>
                                                <span>
                                                  {position}.{idx + 1}. {element?.name || ''}
                                                </span>
                                              </Tooltip>
                                            </Typography>
                                            <Box>{selectedFormDataValue?.data[element?.id] || ''}</Box>
                                          </Box>
                                        </>
                                      );
                                    });
                                  }
                                }
                                return (
                                  <>
                                    {/* pregunta principal */}
                                    <Box
                                      key={`box_attr_${idx}`}
                                      sx={{
                                        fontWeight: 400,
                                        fontSize: '14px',
                                        backgroundColor: '#F4F6F8',
                                        marginBlock: '12px',
                                        padding: '16px'
                                      }}
                                    >
                                      <Typography fontWeight={600} fontSize={14} mb={2}>
                                        <Tooltip title={value.description ?? ''} arrow>
                                          <span>
                                            {position}. {value.name}
                                          </span>
                                        </Tooltip>
                                      </Typography>
                                      <Box>{idResp?.value || ''}</Box>
                                    </Box>
                                    {/* Respuesta */}
                                    {responses || ''}
                                  </>
                                );
                              }
                              return (
                                <Box
                                  key={`box_attr_${idx}`}
                                  sx={{
                                    fontWeight: 400,
                                    fontSize: '14px',
                                    backgroundColor: '#F4F6F8',
                                    marginBlock: '12px',
                                    padding: '16px'
                                  }}
                                >
                                  <Typography fontWeight={600} fontSize={14} mb={2}>
                                    <Tooltip title={value.description ?? ''} arrow>
                                      <span>
                                        {position}. {value.name}
                                      </span>
                                    </Tooltip>
                                  </Typography>
                                  <FormDataType
                                    type={value.attribute_type}
                                    attribute={selectedFormDataValue?.data[value?.id] || ''}
                                  />
                                </Box>
                              );
                            }
                          }
                          if (value.attribute_type === 'title') {
                            return (
                              <Box key={`box_attr_${idx}`} marginY={3} color={'#2A945F'} fontSize={14} fontWeight={700}>
                                {value.name}
                              </Box>
                            );
                          }
                          return (
                            <Box
                              key={`box_attr_${idx}`}
                              sx={{ backgroundColor: '#F4F6F8', marginBlock: '12px', padding: '16px' }}
                            >
                              <Typography fontWeight={600} fontSize={14} mb={2}>
                                <Tooltip title={value.description ?? ''} arrow>
                                  <span>
                                    {position}. {value.name}
                                  </span>
                                </Tooltip>
                              </Typography>

                              <Typography fontWeight={400} fontSize={14}></Typography>
                            </Box>
                          );
                        }
                      )}
                    </>
                  ) : (
                    <Box height={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                      No se seleccionó ningún registro.
                    </Box>
                  )}
                </>
              ) : (
                <Box height={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                  <CircularProgress size={'120px'} />
                </Box>
              )}
            </Box>
            {/* </Paper> */}
          </Grid>
        </Grid>
      </Dialog>

      {/* {viewMap && (
        <ShowMapSection
          handleBackViewMap={handleBackViewMap}
          arrMarkers={arrMarkers}
          arrObjectsToMap={arrObjectsToMap}
          arrPolygons={featurePolygons}
          mapCenterMarkers={mapCenterMarkers}
          mapCenterPolygons={mapCenterPolygons}
          organizationForm={selectedFormDataValue}
          selectedFormDataValue={selectedFormDataValue}
          saveChangesPolygons={saveChangesPolygons}
          isSavingChanges={isSavingChanges}
          id={selectedFormDataValue?.gather_form?.id ?? ''}
          from="forms"
          isShowResponseData={true}
        />
      )} */}
    </>
  );
};

export default FormDialog;
