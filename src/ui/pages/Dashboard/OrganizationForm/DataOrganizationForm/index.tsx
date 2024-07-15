import React, { useState, useCallback, useEffect, ReactNode } from 'react';
import { Icon as Iconify } from '@iconify/react';
import {
  Grid,
  Paper,
  Icon,
  Box,
  Typography,
  // FormControl,
  // Select,
  // MenuItem,
  Divider,
  Tooltip,
  CircularProgress,
  Chip
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ExcelIcon from '@iconify/icons-vscode-icons/file-type-excel';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { OrganizationFormAttribute } from '~models/organizationFormAttribute';
import { OrganizationForm } from '~models/organizationForm';
// import ActionsMenu from '~ui/molecules/ActionsMenu';

// import {
// getOrganizationForm,
// paginateOrganizationFormBasicData,
// downloadOrganizationFormData
// getOrganizationFormDataById,
// updateFormData,
// updateOrganizationFormGeneral
// paginateOrganizationFormGeneralBasicData,
// getOrganizationFormGeneralDataById
// } from '~services/organization/form';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';

import { showMessage } from '~utils/Messages';
import FormDataType from '../components/FormDataType';
import routes from '~routes/routes';
import Button from '~atoms/Button/Button';
import { COMMUNITY_BASE_URL_S3 } from '~config/environment';
import { format } from 'date-fns';
import { formatToTimeZone } from 'date-fns-timezone';
import { es } from 'date-fns/locale';
// import { markerProps } from '../components/MapGeoreference';
import { useSelector } from 'react-redux';
// import { convertGDToUTM } from '~utils/formatCoords';
// import ShowMapSection from './showMapSection';
import ListItemSelect from './ListItemSelect';
// import MapIcon from '@mui/icons-material/Map';
import { makeStyles } from '@mui/styles';
// import { getAreaFromGeometry, getCenterFromGeoJson } from '~utils/areaFromGeometry';
import {
  downloadGatherFormData,
  getFormDataById,
  getOrganizationFormV2,
  paginateListFormsData,
  updateGatherFormData
} from '~services/organization/formsv2';
import { useTheme } from '@mui/material/styles';
// import { AttributesRelation, AttributesRelationDefault } from '~models/clothes';
// import {
//   code_clothe,
//   code_clothe_response_panels,
//   name_clothe,
//   name_clothe_response_panels,
//   name_clothe_response_yarns
// } from '~utils/RequiredIDs';

const FORM_STATUS: any = {
  COMPLETED: {
    display_name: 'Completado',
    color: '#DCFCE7',
    textColor: '#22C55E'
  },
  PENDING: {
    display_name: 'Pendiente',
    color: '#FEF3C7',
    textColor: '#F59E0B'
  },
  UNFINISHED: {
    display_name: 'Incompleto',
    color: '#FEE2E2',
    textColor: '#EF4444'
  }
};

type DataOrganizationFormProps = unknown;

type FormGeoKeys = {
  id: string;
  name: string;
  type: string;
  display_name: string;
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

// type EditedPolygonType = {
//   id: string;
//   value: any;
// };

const DataOrganizationForm: React.FC<DataOrganizationFormProps> = () => {
  const history = useNavigate();
  const classes = useStyles();
  const {
    auth: { organizationTheme }
  }: any = useSelector((state: any) => state);
  const theme = useTheme();
  const [organizationForm, setOrganizationForm] = useState<OrganizationForm | undefined>(undefined);
  let position: number = 0;
  // eslint-disable-next-line
  // @ts-ignore
  const { organization_form_id } = useParams();
  const search = useLocation().search;
  const searchParams = new URLSearchParams(search);

  // const [formType] = useState(searchParams.get('data_type'));
  const [entryEntityType] = useState(searchParams.get('entry_entity_type'));

  if (!organization_form_id) history(routes.organizationForm);
  const organizationFormId: string = organization_form_id !== undefined ? organization_form_id : '';

  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [selectedFormDataValue, setSelectedFormDataValue] = useState<any | undefined>(undefined);
  // const [hasGeo, setHasGeo] = useState(false);
  const [viewMap, setViewMap] = useState(false);
  // const [arrMarkers, setArrMarkers] = useState<Array<any>>([]);
  // const [arrObjectsToMap, setArrObjectsToMap] = useState<Array<any>>([]);
  // const [featurePolygons, setFeaturePolygons] = useState<any | undefined>(undefined);
  // const [keysGeoForm, setKeysGeoForm] = useState<Array<FormGeoKeys>>([]);
  // const [mapCenterMarkers, setMapCenterMarkers] = useState<any[]>(organizationTheme?.initial_gps);
  // const [mapCenterPolygons, setMapCenterPolygons] = useState<any[]>(organizationTheme?.initial_gps);
  const [isDownloadFileLoading, setIsDownloadFileLoading] = useState<boolean>(false);

  // const [selectFormatCoords, setSelectFormatCoords] = useState<number>(0);

  // const [attributesRelation, setAttributesRelation] = useState<AttributesRelation>(AttributesRelationDefault);

  const [code, setCode] = useState<string>('');
  // const [fabric_inventories, setFabricInventories] = useState<string>('');
  const [name, setName] = useState<string>('');
  // const [yarns, setYarns] = useState<string>('');

  // const itemsCoordsFormats = [
  //   { id: 0, description: 'UTM-WSG84', name: 'UTM-WSG84' },
  //   { id: 1, description: 'GD-WSG84', name: 'GD-WSG84' }
  // ];

  const searchResponse = useCallback(
    (row: any, type: 'name' | 'code'): ReactNode => {
      const { data } = row;
      if (data && type === 'name') {
        const value = data[name];
        if (value) {
          return <>{value || ''}</>;
        }
      }
      if (data && type === 'code') {
        const value = data[code];
        if (value) {
          return <>{value || ''}</>;
        }
      }
      return <></>;
    },
    [code, name]
  );

  const loadOrganizationForm = useCallback(() => {
    setIsLoading(true);
    getOrganizationFormV2(organizationFormId)
      .then((res: any) => {
        const data = res.data.data;
        const schemaAttr = data.schema?.data;
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
        setOrganizationForm(res.data.data);
        setIsLoading(false);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar el formulario.', 'error', true);
        setIsLoading(false);
        history(routes.organizationForm);
      });
  }, [organizationFormId, history]);

  // const handleChangeFormat = useCallback((name: string, value: string) => {
  //   setSelectFormatCoords(Number(value));
  // }, []);
  // const handleChangeFormat2 = useCallback((e: any) => {
  //   setSelectFormatCoords(Number(e.target.value));
  // }, []);

  useEffect(() => {
    loadOrganizationForm();
  }, [loadOrganizationForm]);

  // const handleSelectedRow = useCallback((row: any) => {
  //   setSelectedFormDataValue(Object.assign({}, row));
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
  //             setMapCenterPolygons(point);
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

  const handleBackViewMap = useCallback(() => {
    setViewMap(false);
    // setSelectedFormDataValue(Object.assign({}, {}));
  }, []);

  const saveAs = useCallback(
    (url: string) => {
      const link = document.createElement('a');
      document.body.appendChild(link);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = 'download';
      link.href = url;
      link.download = organizationForm?.name ? `${organizationForm?.name}.xlsx` : 'archivo.xlsx';
      link.click();
      document.body.removeChild(link);
    },
    [organizationForm]
  );

  const handleOnDownloadRequest = useCallback(
    (coordsSystemTyp: 'UTM-WSG84' | 'GD-WSG84') => {
      setIsDownloadFileLoading(true);
      downloadGatherFormData(organizationFormId, {
        action: 'generate',
        gather_form_id: organizationFormId,
        coordinate_system: coordsSystemTyp,
        owner_model_id: organizationTheme?.organizationId ?? '',
        owner_mode_type: 'Organizations'
      })
        .then((res: any) => {
          const data = res?.data;

          switch (data?.file_status) {
            case 'completed':
              setIsDownloadFileLoading(false);
              saveAs(COMMUNITY_BASE_URL_S3 + data?.file_path);
              break;
            case 'processing':
              const interval = setInterval(() => {
                downloadGatherFormData(organizationFormId, {
                  action: 'get_result',
                  gather_form_id: organizationFormId,
                  owner_model_id: organizationTheme?.organizationId ?? '',
                  owner_mode_type: 'Organizations'
                })
                  .then((res: any) => {
                    const data = res?.data;

                    switch (data?.file_status) {
                      case 'processing':
                        break;
                      case 'completed':
                        setIsDownloadFileLoading(false);
                        clearInterval(interval);
                        saveAs(COMMUNITY_BASE_URL_S3 + data?.file_path);
                        break;
                      default:
                        setIsDownloadFileLoading(false);
                        clearInterval(interval);
                        showMessage('', 'Problemas al descargar el archivo.', 'error', true);
                        break;
                    }
                  })
                  .catch((err: any) => {
                    setIsDownloadFileLoading(false);
                    clearInterval(interval);
                    const data = err?.response?.data;

                    if (data?.hasOwnProperty('message')) {
                      showMessage('', data?.message ?? '', 'error', true);
                      return;
                    }
                    showMessage('', 'Problemas al descargar el archivo.', 'error', true);
                  });
              }, 2000);
              return;
            default:
              setIsDownloadFileLoading(false);

              showMessage('', 'Problemas al descargar el archivo.', 'error', true);
              break;
          }
        })
        .catch((err: any) => {
          setIsDownloadFileLoading(false);
          const data = err?.response?.data;
          if (data?.hasOwnProperty('message')) {
            showMessage('', data?.message ?? '', 'error', true);
            return;
          }
          showMessage('', 'Problemas al descargar el archivo.', 'error', true);
        });
    },
    [organizationFormId, organizationTheme, saveAs]
  );

  const _paginateOrganizationFormData = useCallback(
    (page: number, per_page: number, sort_by: string, order: string, search: string) => {
      if (entryEntityType) {
        return paginateListFormsData(entryEntityType, page, per_page, sort_by, order, search, organizationFormId);
      }
      // if (formType === 'data') {
      //   return paginateOrganizationFormBasicData(page, per_page, sort_by, order, search, organizationFormId);
      // }
      // return paginateOrganizationFormGeneralBasicData(page, per_page, sort_by, order, search, organizationFormId);
    },
    [organizationFormId, entryEntityType]
  );

  const [isLoadingFormData, setIsLoadingFormData] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rowSelected, setRowSelected] = useState<any>(undefined);

  const _getOrganizationFormById = useCallback((organizationFormId: any, id: any) => {
    // if (formType === 'data') {
    //   return getOrganizationFormDataById(organizationFormId, id);
    // }

    // return getOrganizationFormGeneralDataById(organizationFormId, id);
    return getFormDataById(organizationFormId, id);
  }, []);

  const loadDataRowSelected = useCallback(
    (row: any) => {
      // if (row) {
      setIsLoadingFormData(true);
      // if (selectedFormDataValue) {
      //   setSelectedFormDataValue((prev: any) => {
      //     return { ...prev, farmer: row?.entry_actor ?? {}, agro_leader: row?.gatherer_actor ?? {} };
      //   });
      // }
      // console.log(row);
      setRowSelected(row);
      // setRowIdSelected(row.id);
      _getOrganizationFormById(organizationFormId, row.id)
        .then((resp: any) => {
          setSelectedFormDataValue(() => {
            return { ...resp.data.data, farmer: row?.entry_actor ?? {}, agro_leader: row?.gatherer_actor ?? {} };
          });
          setIsLoadingFormData(false);
        })
        .catch(() => {
          setSelectedFormDataValue(undefined);
          setIsLoadingFormData(false);
        });
      // }
    },
    [_getOrganizationFormById, organizationFormId]
  );

  const renderItem = useCallback(
    (row: any) => {
      return (
        <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} pl={1}>
          {entryEntityType === 'PRODUCER' ? (
            <>
              <Typography color={'#212B36'} fontWeight={700} fontSize={14}>
                {row.entry_actor?.full_name ?? ''}
              </Typography>
              <Typography color={'#536471'} fontWeight={700} fontSize={12}>
                {row.gatherer_actor?.full_name ?? ''}
              </Typography>
            </>
          ) : entryEntityType === 'FREE' ? (
            <>
              {/* <Box display="flex">
                <Typography color={'#212B36'} fontWeight={700} fontSize={15}>
                  {searchResponse(row, 'name')}
                </Typography>
              </Box> */}
              <Box display="flex">
                <Typography color={'#637381'} fontWeight={500} fontSize={13}>
                  Código:&nbsp;
                </Typography>
                <Typography color={'#212B36'} fontWeight={700} fontSize={14} style={{ lineBreak: 'anywhere' }}>
                  {searchResponse(row, 'code') || ''}
                </Typography>
              </Box>
              <Box display="flex">
                <Typography color={'#637381'} fontWeight={500} fontSize={13}>
                  Usuario:&nbsp;
                </Typography>
                <Typography color={'#212B36'} fontWeight={700} fontSize={14}>
                  {row?.gatherer_actor?.full_name ?? ''}
                </Typography>
              </Box>
            </>
          ) : (
            entryEntityType === 'PRODUCTIVE_UNIT' && (
              <>
                <Typography color={'#212B36'} fontWeight={700} fontSize={14}>
                  {row.entry_actor?.producer?.full_name ?? ''}
                </Typography>
                <Typography color={'#536471'} fontWeight={700} fontSize={12}>
                  {row.gatherer_actor?.full_name ?? ''}
                </Typography>
              </>
            )
          )}

          <Typography color={'#637381'} fontWeight={500} fontSize={13}>
            {format(new Date(row.created_at), 'dd MMM yyyy', { locale: es })}&nbsp;-&nbsp;
            {formatToTimeZone(new Date(row.created_at), 'hh:mm aa', {
              timeZone: 'America/Lima'
            })}
          </Typography>
          {/* <Typography color={'#637381'} fontWeight={400} fontSize={14}></Typography> */}
        </Box>
      );
    },
    [entryEntityType, searchResponse]
  );

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

  // const [isSavingChanges, setIsSavingChanges] = useState<boolean>(false);

  const _updateFormData = useCallback((organizationFormId: any, id: any, data: any) => {
    return updateGatherFormData(organizationFormId, id, data);
    // if (entryEntityType !== 'FREE') {
    //   return updateFormData(organizationFormId, id, data);
    // }
    // return updateOrganizationFormGeneral(organizationFormId, id, data);
  }, []);

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
  //     _updateFormData(organizationFormId, selectedFormDataValue.id, { data })
  //       .then((_resp: any) => {
  //         // console.log(resp);
  //         setIsSavingChanges(false);
  //         showMessage('', 'Los polígonos se editaron correctamente.', 'success', false);
  //         setViewMap(false);
  //         loadDataRowSelected(rowSelected);
  //       })
  //       .catch((_error: any) => {
  //         setIsSavingChanges(false);
  //         showMessage('', 'Error al editar los polígonos.', 'error', true);
  //         // console.log(error);
  //       });

  //     // console.log(data);
  //   },
  //   [
  //     getStrLatLngFromGeoJson,
  //     loadDataRowSelected,
  //     organizationFormId,
  //     rowSelected,
  //     selectedFormDataValue,
  //     _updateFormData
  //   ]
  // );

  useEffect(() => {
    if (organizationTheme?.attributes_relation && Array.isArray(organizationTheme?.attributes_relation)) {
      const relation = organizationTheme?.attributes_relation.find(
        (element: any) => element?.gather_form_id === organization_form_id
      );
      if (relation) {
        setCode(relation?.attributes_relationship?.code ?? '');
        // setFabricInventories(relation?.attributes_relationship?.fabric_inventories ?? '');
        setName(relation?.attributes_relationship?.name ?? '');
        // setYarns(relation?.attributes_relationship?.yarns ?? '');
      }
    }
  }, [organizationTheme?.attributes_relation, organization_form_id]);

  return (
    <>
      <Box mb="20px">
        <Grid container>
          <Grid item={true} xs={12} sm={12} md={12} lg={viewMap ? 12 : 6} xl={viewMap ? 12 : 6}>
            <Box mr="10px" fontSize="1.7em" fontWeight={400} mb="5px" color={theme.palette.primary.main}>
              Formularios
            </Box>
            <Breadcrumbs
              breadcrumbs={[
                {
                  path: routes.dashboard,
                  component: <Icon fontSize="small">home</Icon>
                },
                {
                  path: routes.organizationForm,
                  component: 'Formularios'
                },
                {
                  // path: routes.organizationForm,
                  component: entryEntityType !== 'FREE' ? 'Formularios de productor' : 'Formularios de organización'
                },
                {
                  component: organizationForm?.name,
                  onClick: viewMap ? handleBackViewMap : undefined
                },
                viewMap
                  ? {
                      component: 'Georreferencia del formulario'
                    }
                  : {
                      component: ''
                    }
              ]}
            />
          </Grid>
        </Grid>
      </Box>

      {isLoading && (
        <Box mb={2}>
          <LinearProgress loading={true} />
        </Box>
      )}

      <Grid container>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} mb={2}>
          <Paper elevation={3} sx={{ padding: '20px' }}>
            <Box
              display="flex"
              flexDirection={{ xs: 'column', md: 'row' }}
              justifyContent={'space-between'}
              alignItems={{ xs: 'flex-start', md: 'center' }}
            >
              <Box>
                <Typography color={'#637381'} fontWeight={700} fontSize={12} mb={{ xs: 1, md: 3 }}>
                  FORMULARIO
                </Typography>
                <Box mr="10px" fontSize={{ xs: '18px', md: '24px' }} fontWeight={700} mb="5px" color="#212B36">
                  {organizationForm?.name}
                </Box>
              </Box>
              <Box width={{ xs: '100%', md: 'auto' }}>
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon={ExcelIcon} />}
                  text="Descargar Excel"
                  fullWidth
                  disabled={isDownloadFileLoading}
                  isLoading={isDownloadFileLoading}
                  onClick={() => {
                    handleOnDownloadRequest('UTM-WSG84');
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid container spacing={2}>
          <Grid item={true} xs={12} sm={12} md={4} lg={4} xl={4} mb={2}>
            <Paper
              elevation={3}
              sx={{
                padding: '20px',
                height: '58vh',
                display: 'flex',
                flexDirection: 'column'
              }}
              // className={classes.scrollBarClass}
            >
              <Typography color={'#212B36'} fontWeight={700} fontSize={16}>
                REGISTROS
              </Typography>

              <ListItemSelect
                paginate={_paginateOrganizationFormData}
                loadDataRowSelected={loadDataRowSelected}
                renderItem={renderItem}
              />
            </Paper>
          </Grid>
          <Grid item={true} xs={12} sm={12} md={8} lg={8} xl={8} mb={2}>
            <Paper className={classes.scrollBarClass} elevation={3} sx={{ padding: '20px', height: '58vh' }}>
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
                        <Box>
                          <Typography component={'span'} color={'#0F1419'} fontWeight={700} fontSize={13}>
                            USUARIO:&nbsp;
                          </Typography>
                          {selectedFormDataValue?.agro_leader?.full_name?.toUpperCase() || ''}
                          <Typography component={'span'} color={'#0F1419'} fontWeight={700} fontSize={13} ml={2}>
                            FECHA:&nbsp;
                          </Typography>
                          {format(new Date(selectedFormDataValue?.created_at), 'dd MMM yyyy', {
                            locale: es
                          }).toUpperCase()}
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
                              backgroundColor: FORM_STATUS[selectedFormDataValue?.form_fill_status].color ?? '#DCFCE7',
                              color: FORM_STATUS[selectedFormDataValue?.form_fill_status].textColor ?? '#22C55E'
                            }}
                          />
                        </Box>
                      </Box>
                      <Box display={'flex'} alignItems={'center'} color={'#637381'} fontWeight={700} fontSize={13}>
                        {entryEntityType !== 'FREE' && (
                          <>
                            <Typography component={'span'} color={'#0F1419'} fontWeight={700} fontSize={13}>
                              PRODUCTOR:&nbsp;
                            </Typography>
                            {entryEntityType === 'PRODUCER'
                              ? (selectedFormDataValue?.farmer?.full_name ?? '').toUpperCase()
                              : (selectedFormDataValue?.farmer?.producer?.full_name ?? '').toUpperCase()}
                          </>
                        )}
                        {/* {hasGeo && (
                          <>
                            <Typography component={'span'} color={'#0F1419'} fontWeight={700} fontSize={13} ml={2}>
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
                          </>
                        )} */}
                      </Box>
                      {/* {false && (
                        <Box>
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
                        </Box>
                      )} */}
                      <Divider />
                      {/* box categoría */}
                      {renderFarmBox(selectedFormDataValue)}
                      {organizationForm?.schema?.data?.map((value: OrganizationFormAttribute, idx: number) => {
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
                            if (value.attribute_type === 'model') {
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
                            <Box
                              key={`box_attr_${idx}`}
                              marginY={3}
                              color={theme.palette.primary.main}
                              fontSize={14}
                              fontWeight={700}
                            >
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
                      })}
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
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      {/* {viewMap && (
        <ShowMapSection
          handleBackViewMap={handleBackViewMap}
          arrMarkers={arrMarkers}
          arrObjectsToMap={arrObjectsToMap}
          arrPolygons={featurePolygons}
          mapCenterMarkers={mapCenterMarkers}
          mapCenterPolygons={mapCenterPolygons}
          organizationForm={organizationForm}
          selectedFormDataValue={selectedFormDataValue}
          saveChangesPolygons={saveChangesPolygons}
          isSavingChanges={isSavingChanges}
          id={organizationFormId}
          from="forms"
        />
      )} */}
    </>
  );
};

export default DataOrganizationForm;
