import React, { useState, useCallback, useEffect } from 'react';
import {
  Grid,
  Paper,
  Box,
  Radio,
  Dialog,
  useMediaQuery,
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel
} from '@mui/material';
import { Icon as Iconify } from '@iconify/react';
import ArrowBack from '@iconify/icons-ic/arrow-back';
import IcLocation from '@iconify/icons-ic/location-on';
import IcComponents from '@iconify/icons-ic/format-shapes';
import IcInfo from '@iconify/icons-ic/info';
import IcBaseline from '@iconify/icons-ic/baseline-eco';
import IcArea from '@iconify/icons-ic/twotone-area-chart';
import MapGeoreference from '../../MapGeoreferenceHa';
// import MapGeoreference from '../components/MapGeoreference';
import Button from '~atoms/Button/Button';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
// import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { makeStyles } from '@mui/styles';
import { showMessage } from '~utils/Messages';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';

const useStyles: any = makeStyles(() => ({
  boxToolbar: {
    display: 'flex',
    justifyContent: 'center',
    // position: 'relative',
    bottom: '100px',
    zIndex: 999,
    width: '170px',
    left: '27%',
    borderRadius: '12px',
    backgroundColor: 'white',
    padding: '8px'
  },
  optionToolbar: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    // margin: '8px',
    color: '#00AB55',
    padding: '8px',
    borderRadius: '12px',
    '&:hover': {
      backgroundColor: 'rgba(0, 171, 85, 0.08)',
      cursor: 'pointer'
    }
  },
  optionToolbarCancel: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    // margin: '8px',
    color: '#687782',
    padding: '8px',
    borderRadius: '12px',
    '&:hover': {
      backgroundColor: 'rgba(0, 171, 85, 0.08)',
      cursor: 'pointer'
    }
  },
  badgeEdited: {
    backgroundColor: '#FFD700',
    color: 'white',
    borderRadius: '50%',
    width: '25px',
    height: '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px !important'
  }
}));

type ShowMapSectionProps = {
  handleBackViewMap: () => void;
  arrMarkers: any[];
  arrObjectsToMap: any[];
  arrPolygons: any;
  mapCenterMarkers: any[];
  mapCenterPolygons: any[];
  organizationForm: any;
  selectedFormDataValue: any;
  saveChangesPolygons: (editedPolygons: any[]) => void;
  isSavingChanges: boolean;
  from: 'units' | 'forms';
  id: string;
  isShowResponseData?: boolean;
};

type EditedPolygonType = {
  id: string;
  value: any;
};

const ShowMapSection: React.FC<ShowMapSectionProps> = (props: ShowMapSectionProps) => {
  const {
    handleBackViewMap,
    arrMarkers,
    arrObjectsToMap,
    arrPolygons,
    mapCenterMarkers,
    mapCenterPolygons,
    organizationForm,
    selectedFormDataValue,
    saveChangesPolygons,
    isSavingChanges,
    from,
    isShowResponseData
  } = props;
  const classes = useStyles();
  const [filterSelected, setFilterSelected] = useState<string>('1');
  // const [addMarker, setAddMarker] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isCancel, setIsCancel] = useState<boolean>(false);
  const [polygonEditMode, setPolygonEditMode] = useState<boolean>(false);
  const [polygonCancelEdit, setPolygonCancelEdit] = useState<boolean>(false);
  const [polygonSaveEdit, setPolygonSaveEdit] = useState<boolean>(false);
  const [editedPolygons, setEditedPolygons] = useState<EditedPolygonType[]>([]);
  const [refreshMap, setRefreshMap] = useState<boolean>(false);
  const themes = useTheme();
  const isActiveDesktop = useMediaQuery(themes.breakpoints.down('md'));
  // const handleOnClickAddMarker = useCallback(() => {
  //   setAddMarker((prev: boolean) => !prev);
  // }, []);

  const handleRefreshMap = useCallback(() => {
    setRefreshMap(true);
    setTimeout(() => {
      setRefreshMap(false);
    }, 1);
  }, []);

  const handleOnClickEditPolygon = useCallback(() => {
    // if (filterSelected !== '1') {
    setPolygonEditMode((prev: boolean) => !prev);
    // } else {
    //   console.log('Cambie de filtro para editar polígonos.');
    // }
  }, []);

  const handleSaveEditedPolygons = useCallback((value: any) => {
    setEditedPolygons((prev: EditedPolygonType[]) => {
      const samePolygon = prev.findIndex((e: EditedPolygonType) => e.id === value.id);
      if (samePolygon >= 0) {
        return prev.map((c: EditedPolygonType, i: number) => {
          if (i === samePolygon) {
            return value;
          }
          return c;
        });
      }
      return [...prev, value];
    });
  }, []);

  const handleOnClickCancelEditPolygon = useCallback(() => {
    setPolygonCancelEdit((prev: boolean) => !prev);
    setPolygonEditMode(false);
  }, []);

  const handleOnClickSaveEditPolygon = useCallback(() => {
    setPolygonSaveEdit((prev: boolean) => !prev);
    setPolygonEditMode(false);
    // handleOnClickEditPolygon();
  }, []);

  // const handleOnAddMarker = useCallback(
  //   (obj: any) => {
  //obtiene el marcador agregado
  // console.log(obj);
  //     handleOnClickAddMarker();
  //   },
  //   [handleOnClickAddMarker]
  // );

  const handleEditMode = useCallback((value: boolean) => {
    setEditMode(value);
  }, []);

  const handleOnClickCancelEdit = useCallback(() => {
    setIsCancel((prev: boolean) => !prev);
    handleOnClickCancelEditPolygon();
    handleEditMode(false);
    setEditedPolygons([]);

    if (editedPolygons.length > 0) {
      handleRefreshMap();
    }
  }, [editedPolygons, handleEditMode, handleOnClickCancelEditPolygon, handleRefreshMap]);

  const handleBack = useCallback(() => {
    if (editMode) {
      handleOnClickCancelEdit();
    } else {
      handleBackViewMap();
    }
  }, [editMode, handleOnClickCancelEdit, handleBackViewMap]);

  const handleChangeFilter = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!polygonEditMode) {
        setEditMode(false);
        setFilterSelected((event.target as HTMLInputElement).value);
      } else {
        showMessage('', 'Debe guardar o descartar los cambios realizados en el mapa.', 'info', false);
      }
    },
    [polygonEditMode]
  );

  const handleSaveChanges = useCallback(() => {
    //para guardar formulario primero parsear "lat long, lat long"
    // console.log(editedPolygons);
    // console.log(id);
    if (editedPolygons.length > 0) {
      saveChangesPolygons(editedPolygons);
    } else {
      showMessage('', 'No se detectaron cambios en los polígonos.', 'info', false);
    }
    // editedPolygons.length > 0 &&
    // editedPolygons.forEach((value: EditedPolygonType) => {
    //   updateFormData(id, value.id, value.value)
    //     .then((resp: any) => {
    //       console.log(resp);
    //     })
    //     .catch((error: any) => {
    //       console.log(error);
    //     });
    // });
  }, [editedPolygons, saveChangesPolygons]);

  useEffect(() => {
    if (from === 'units') {
      setFilterSelected('2');
      handleEditMode(true);
    }
  }, [from, handleEditMode]);

  return (
    <Dialog open title="" maxWidth={false} onClose={() => handleBack()}>
      <Grid container p={4}>
        <Box display="flex" alignItems="center">
          <Box width="18%">
            <Button
              text=""
              variant="text"
              onClick={handleBack}
              sx={{
                color: '#687782',
                '&:hover': {
                  backgroundColor: '#ffffff'
                }
              }}
              startIcon={<Iconify icon={ArrowBack} width="46px" />}
            />
          </Box>
          <Box>
            <Typography fontWeight={700} fontSize={18} color="#212B36">
              Georreferencia de puntos gps del formulario
            </Typography>
          </Box>
        </Box>
        <Grid container={true} spacing={2}>
          {/* MAPA */}
          <Grid item={true} xs={12} sm={12} md={8} lg={8} xl={8}>
            <Paper elevation={3} sx={{ height: '100%', borderRadius: '16px' }}>
              {filterSelected === '2' && (
                <>
                  <Box display="flex" justifyContent={'flex-end'}>
                    {editMode ? (
                      <>
                        <Button
                          variant="contained"
                          text={'Guardar cambios'}
                          onClick={handleSaveChanges}
                          isLoading={isSavingChanges}
                          disabled={isSavingChanges}
                          endIcon={
                            editedPolygons.length > 0 ? (
                              <Box className={classes.badgeEdited}>{editedPolygons.length}</Box>
                            ) : (
                              ''
                            )
                          }
                        />
                        <Button variant="outlined" text={'Cancelar'} onClick={handleOnClickCancelEdit} />
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outlined"
                          text={'Editar mapa'}
                          disabled={isSavingChanges}
                          endIcon={<EditRoundedIcon />}
                          onClick={() => handleEditMode(true)}
                        />
                      </>
                    )}
                  </Box>
                  {editMode && (
                    <Box display="flex" justifyContent={'flex-end'} mr={'12px'}>
                      <Typography fontSize={'12px'} color={'#00822B'}>
                        *El cálculo del área se realizará una vez guardado los cambios
                      </Typography>
                    </Box>
                  )}
                </>
              )}
              <Box p={2} height="100%">
                {!refreshMap ? (
                  <MapGeoreference
                    markers={arrMarkers}
                    arrObjectsToMap={arrObjectsToMap}
                    polygons={arrPolygons}
                    filterSelected={filterSelected}
                    // addMarker={addMarker}
                    refresh={isCancel}
                    polygonEditMode={polygonEditMode}
                    center={filterSelected === '1' ? mapCenterMarkers : mapCenterPolygons}
                    // handleOnAddMarker={handleOnAddMarker}
                    polygonCancelEdit={polygonCancelEdit}
                    polygonSaveEdit={polygonSaveEdit}
                    handleSaveEditedPolygons={handleSaveEditedPolygons}
                    from={from} //units - forms
                  />
                ) : (
                  <Box display="flex" justifyContent={'center'} alignItems="center" minHeight={'380px'}>
                    <CircularProgress />
                  </Box>
                )}
                {editMode && (
                  <Box className={classes.boxToolbar} style={{ position: isActiveDesktop ? 'relative' : 'absolute' }}>
                    {/* <Box onClick={handleOnClickAddMarker} className={classes.optionToolbar}>
                        <PlaceRoundedIcon />
                        <Typography>Agregar marcador</Typography>
                      </Box> */}
                    {polygonEditMode ? (
                      <Box
                        style={{
                          backgroundColor: '#CDF1DF66',
                          marginLeft: '8px',
                          display: 'flex',
                          borderRadius: '12px'
                        }}
                      >
                        <Box onClick={handleOnClickSaveEditPolygon} className={classes.optionToolbar}>
                          <CheckRoundedIcon />
                          <Typography>Guardar</Typography>
                        </Box>
                        <Box onClick={handleOnClickCancelEditPolygon} className={classes.optionToolbarCancel}>
                          <CloseRoundedIcon />
                          <Typography>Cancelar</Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box onClick={handleOnClickEditPolygon} className={classes.optionToolbar}>
                        <BorderColorIcon />
                        <Typography>Editar {filterSelected === '1' ? 'puntos gps' : 'polígonos'} </Typography>
                      </Box>
                    )}
                  </Box>
                )}
                <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                  <Typography fontWeight={700} fontSize={18} color="#212B36" mr={1}>
                    Ubicación de Unidad Productiva
                  </Typography>
                  <Iconify icon={IcInfo} color="#EB5757" width={25} />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* DATOS DEL FORMULARIO Y DEL PRODUCTOR */}
          <Grid
            item={true}
            xs={12}
            sm={12}
            md={4}
            lg={4}
            xl={4}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Paper elevation={3} sx={{ padding: '20px', marginBottom: '16px', borderRadius: '16px' }}>
              <Typography fontWeight={700} fontSize={18} color="#212B36" mb={2}>
                {organizationForm?.name}
              </Typography>
              {selectedFormDataValue?.organization_forms_values?.farm_name_value !== undefined && (
                <Box display="flex" mb={2}>
                  <Iconify icon={IcLocation} />
                  <Typography fontWeight={500} fontSize={14} color="#212B36" pl={2}>
                    {selectedFormDataValue?.organization_forms_values?.farm_name_value?.toUpperCase() ?? ''}
                  </Typography>
                </Box>
              )}

              {isShowResponseData ? (
                <>
                  <Box display="flex" mb={2}>
                    <Iconify icon={IcComponents} />
                    <Typography fontWeight={500} fontSize={14} color="#212B36" pl={2}>
                      {selectedFormDataValue?.gather_form?.entry_entity_type === 'PRODUCER'
                        ? (selectedFormDataValue?.farmer?.full_name ?? '').toUpperCase()
                        : (selectedFormDataValue?.farmer?.producer?.full_name ?? '').toUpperCase()}
                    </Typography>
                  </Box>
                  <Box display="flex">
                    <Iconify icon={IcBaseline} />
                    <Typography fontWeight={500} fontSize={14} color="#212B36" pl={2}>
                      {selectedFormDataValue?.farmer?.name}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box display="flex" mb={2}>
                  <Iconify icon={IcComponents} />
                  <Typography fontWeight={500} fontSize={14} color="#212B36" pl={2}>
                    {selectedFormDataValue?.farmer?.full_name}
                  </Typography>
                </Box>
              )}

              {/* FARM DATA */}
              {organizationForm?.form_type === 'farm' &&
                selectedFormDataValue?.farm !== undefined &&
                selectedFormDataValue?.farm !== null && (
                  <>
                    <Typography fontWeight={700} fontSize={15} color="#212B36">
                      Información de unidad productiva
                    </Typography>
                    <Box display="flex">
                      <Iconify icon={IcBaseline} />
                      <Typography fontWeight={500} fontSize={14} color="#212B36" pl={2}>
                        {selectedFormDataValue?.farm?.name}
                      </Typography>
                    </Box>
                    <Box display="flex" mb={2}>
                      <Iconify icon={IcArea} />
                      <Typography fontWeight={500} fontSize={14} color="#212B36" pl={2}>
                        Area Total:{' '}
                        {selectedFormDataValue?.farm?.size
                          ? `${selectedFormDataValue?.farm?.size} ha`
                          : 'No registrado'}
                      </Typography>
                    </Box>
                  </>
                )}
            </Paper>
            <Paper elevation={3} sx={{ padding: '20px', borderRadius: '16px', marginBottom: '16px' }}>
              <Typography fontWeight={700} fontSize={18} color="#212B36">
                Filtro
              </Typography>
              <FormControl>
                <RadioGroup
                  defaultValue={'1'}
                  value={filterSelected}
                  name="radio-buttons-group"
                  onChange={handleChangeFilter}
                >
                  <FormControlLabel value="1" control={<Radio />} label="Punto de coordenada" />
                  <FormControlLabel value="2" control={<Radio />} label="Polígono de área" />
                </RadioGroup>
              </FormControl>
            </Paper>
            <Paper elevation={3} sx={{ padding: '20px', borderRadius: '16px', color: '#212B36' }}>
              <Typography fontWeight={700} fontSize={18} mb={1}>
                Leyenda
              </Typography>
              {arrObjectsToMap.length > 0 ? (
                arrObjectsToMap.map((element: any) => {
                  return (
                    <Box display={'flex'} key={`${element.name}`}>
                      <CameraAltIcon />
                      &nbsp;{element.name}
                    </Box>
                  );
                })
              ) : (
                <>Sin objetos disponibles</>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default ShowMapSection;
