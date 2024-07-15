import React, { useCallback, useState } from 'react';
import { Dialog, DialogContent, Box, FormControl, Paper, Grid, Typography } from '@mui/material';
import { TextField, Icon, Divider, Fab } from '@mui/material';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import Scrollbar from '~ui/atoms/Scrollbar/Scrollbar';
import { OrganizationFormAttribute } from '~models/organizationFormAttribute';
import { MobileDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Button from '~ui/atoms/Button/Button';
import { showMessage } from '~utils/Messages';
import SaveSvg from '~assets/icons/save.svg';
import { useTheme } from '@mui/material';

type PreviewOrganizationFormProps = {
  attributes: any[];
  organizationForm: any;
  onSave: () => Promise<string>;
  onClose: (isRefresh?: boolean) => void;
};

type ComponentOrganizationForm = {
  attribute: OrganizationFormAttribute;
};

const ComponentOrganizationForm: React.FC<ComponentOrganizationForm> = (props: ComponentOrganizationForm) => {
  const { attribute }: ComponentOrganizationForm = props;
  const theme = useTheme();
  const [valuePicker, setValuePicker] = useState<Date | null>(null);
  const [simpleSelect, setSimpleSelect] = useState<string>('');
  const [multipleSelect, setMultipleSelect] = useState<string[]>([]);
  const [gpsPoint, setGpsPoint] = useState<any>({ lat: '-12.08547', lng: '-76.88123' });
  const [polygon, setPolygon] = useState<any[]>([]);

  const handleChangeDatePicker = useCallback((date: Date | null) => {
    setValuePicker(date);
  }, []);

  const handleChangeSimpleSelect = useCallback((event: { target: { value: string } }) => {
    setSimpleSelect(event.target.value);
  }, []);

  const handleChangeMultipleSelect = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value }
    } = event;
    setMultipleSelect(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  }, []);

  const handleChangeGpsPoint = useCallback(() => {
    setGpsPoint({
      lat: `-12.${String(Math.random()).split('.')[1].slice(0, 5)}`,
      lng: `-76.${String(Math.random()).split('.')[1].slice(0, 5)}`
    });
  }, []);

  const handleChangePolygon = useCallback(() => {
    setPolygon((prevValue: any) => [
      ...prevValue,
      {
        lat: `-12.${String(Math.random()).split('.')[1].slice(0, 5)}`,
        lng: `-76.${String(Math.random()).split('.')[1].slice(0, 5)}`
      }
    ]);
  }, []);

  const handleRemovePolygon = useCallback((index: number) => {
    setPolygon((prevValue: any) => prevValue.filter((_: any, i: number) => i !== index));
  }, []);

  const renderComponent = useCallback(
    (attribute: OrganizationFormAttribute) => {
      switch (attribute.attribute_type) {
        case 'string':
          return <TextField variant="standard" fullWidth />;
        case 'number':
          return <TextField type="number" variant="standard" fullWidth />;
        case 'photo':
          return (
            <Box display="flex" justifyContent="center" pt={1}>
              <Icon sx={{ color: 'gray', fontSize: '5em !important' }}>insert_photo</Icon>
            </Box>
          );
        case 'audio':
          return (
            <Box display="flex" justifyContent="center" pt={1}>
              <Icon sx={{ color: 'gray', fontSize: '5em !important' }}>volume_up</Icon>
            </Box>
          );
        case 'signature':
          return (
            <Box display="flex" justifyContent="center" pt={1}>
              <Icon sx={{ color: 'gray', fontSize: '5em !important' }}>border_color</Icon>
            </Box>
          );
        case 'altitude':
          return (
            <Box display="flex" pt={1} fontSize="0.8em">
              *Altitud 40 m.s.n.m.
            </Box>
          );
        case 'gps_point':
          return (
            <Box pt={1}>
              <Box>
                Latitud: {gpsPoint.lat}
                <br />
                Longitud: {gpsPoint.lng}
              </Box>
              <Box display="flex" justifyContent="flex-end">
                <Fab size="small" color="primary" onClick={handleChangeGpsPoint}>
                  <Icon>refresh</Icon>
                </Fab>
              </Box>
            </Box>
          );
        case 'georeference':
          return (
            <Box pt={1}>
              <Box>
                {polygon.map((point: any, index: number) => (
                  <Box key={`polygon_${JSON.stringify(point)}`} mb={1}>
                    <Box display="flex" justifyContent="space-between" my={1}>
                      <Box>
                        *Latitud: {point.lat}
                        <br />
                        *Longitud: {point.lng}
                      </Box>
                      <Box>
                        <Fab
                          size="small"
                          color="primary"
                          onClick={() => handleRemovePolygon(index)}
                          sx={{
                            borderRadius: '10px',
                            bgcolor: '#EB5757',
                            '&:hover': {
                              bgcolor: '#eb5757e6'
                            }
                          }}
                        >
                          <Icon>delete</Icon>
                        </Fab>
                      </Box>
                    </Box>
                    <Divider />
                  </Box>
                ))}
              </Box>
              <Box display="flex" justifyContent="flex-end">
                <Fab size="small" color="primary" onClick={handleChangePolygon}>
                  <Icon>add</Icon>
                </Fab>
              </Box>
            </Box>
          );
        case 'date':
          return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                inputFormat="dd-MM-yyyy"
                value={valuePicker}
                onChange={handleChangeDatePicker}
                renderInput={(params: any) => <TextField {...params} variant="standard" fullWidth />}
              />
            </LocalizationProvider>
          );
        case 'list_options':
          return (
            <FormControl fullWidth variant="standard">
              <Select value={simpleSelect} onChange={handleChangeSimpleSelect} displayEmpty>
                <MenuItem value="" disabled>
                  Seleccione un valor
                </MenuItem>
                {attribute?.possible_values?.map((option: any) => (
                  <MenuItem key={`attribute_value_${option}`} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        case 'multiple_selection':
          return (
            <FormControl fullWidth variant="standard">
              <Select multiple value={multipleSelect} onChange={handleChangeMultipleSelect}>
                <MenuItem value="" disabled>
                  Seleccione un valor
                </MenuItem>
                {attribute?.possible_values?.map((option: any) => (
                  <MenuItem key={`attribute_multiple_value_${option}`} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        case 'conditional':
          return (
            <FormControl fullWidth variant="standard">
              <Select value={simpleSelect} onChange={handleChangeSimpleSelect} displayEmpty>
                <MenuItem value="" disabled>
                  Seleccione un valor
                </MenuItem>
                {attribute?.schemas?.map((option: any) => (
                  <MenuItem key={`attribute_value_${option.id}`} value={option.id}>
                    {option.name ?? ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        case 'formula':
          return (
            <Typography color={theme.palette.primary.main} fontSize={12} fontWeight={400}>
              {attribute?.name ?? ''}
            </Typography>
          );
        case 'title':
          return (
            <Typography color={theme.palette.primary.dark} fontSize={15} fontWeight={700}>
              {attribute?.name ?? ''}
            </Typography>
          );
        default:
          return <></>;
      }
    },
    [
      handleChangeDatePicker,
      valuePicker,
      simpleSelect,
      handleChangeSimpleSelect,
      multipleSelect,
      handleChangeMultipleSelect,
      handleChangeGpsPoint,
      gpsPoint,
      handleChangePolygon,
      polygon,
      handleRemovePolygon,
      theme
    ]
  );

  return (
    <Paper elevation={2} sx={{ p: 1 }}>
      {['photo'].includes(attribute.attribute_type) && (
        <Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Box color={theme.palette.primary.main} fontSize="12px">
              {attribute.name} {attribute.is_required && '(Obligatorio)'}
            </Box>
            <Icon sx={{ color: theme.palette.primary.main, fontSize: '18px !important' }}>add_photo_alternate</Icon>
          </Box>
          <Divider sx={{ border: '1px solid #c3c3c3' }} />
        </Box>
      )}
      {['audio', 'signature'].includes(attribute.attribute_type) && (
        <Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Box color={theme.palette.primary.main} fontSize="12px">
              {attribute.name} {attribute.is_required && '(Obligatorio)'}
            </Box>
            <Icon sx={{ color: theme.palette.primary.main, fontSize: '18px !important' }}>arrow_forward_ios</Icon>
          </Box>
          <Divider sx={{ border: '1px solid #c3c3c3' }} />
        </Box>
      )}
      {[
        'number',
        'string',
        'date',
        'list_options',
        'multiple_selection',
        'gps_point',
        'georeference',
        'altitude'
      ].includes(attribute.attribute_type) && (
        <Box color={theme.palette.primary.main} fontSize="12px">
          {attribute.name} {attribute.is_required && '(Obligatorio)'}
        </Box>
      )}

      <Box mb={1}>{renderComponent(attribute)}</Box>
    </Paper>
  );
};

const PreviewOrganizationForm: React.FC<PreviewOrganizationFormProps> = (props: PreviewOrganizationFormProps) => {
  const { attributes, organizationForm, onSave, onClose }: PreviewOrganizationFormProps = props;
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const theme = useTheme();

  const handleSubmit = useCallback(() => {
    setIsSaving(true);
    onSave()
      .then((response: string) => {
        showMessage('', response, 'success');
        onClose(true);
      })
      .catch((error: string) => {
        setIsSaving(false);
        showMessage('', error, 'error', true);
      });
  }, [onSave, onClose]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog open maxWidth="md" fullWidth>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <Box display="flex" flexDirection="column" justifyContent="space-around" height="100%">
              <Box></Box>
              <Box mb={1}>
                <Box
                  display={'flex'}
                  justifyContent={'center'}
                  textAlign="center"
                  fontWeight={700}
                  fontSize="1.1em"
                  mb="0.6em"
                >
                  <img src={SaveSvg} style={{ color: theme.palette.primary.main }} alt="" />
                </Box>
                <Box textAlign="center" fontWeight={700} fontSize="1.1em" mb="0.6em">
                  ¡Has modificado tu formulario!
                </Box>
                <Box textAlign="center" fontSize="1em" mb="0.6em">
                  Recuerda seguir los siguientes pasos:
                </Box>
                <Box fontSize="1em" px="1.6em" display="flex">
                  <Typography mr={1}>1.</Typography>
                  <Typography>Infórmale al agente sobre la actualización del formulario.</Typography>
                </Box>
                <Box fontSize="1em" px="1.6em" py={1} display="flex">
                  <Typography mr={1}>2.</Typography>
                  <Typography>
                    El agente debe conectarse a internet y al ingresar a su aplicativo móvil los formularios se
                    sincronizarán de forma inmediata.
                  </Typography>
                </Box>

                <Box fontSize="1em" px="1.6em" display="flex">
                  <Typography mr={1}>3.</Typography>
                  <Typography>¡El agente ya puede utilizar el nuevo formulario!</Typography>
                </Box>
              </Box>
              <Box>
                <Box textAlign="center" fontSize="0.9em" paddingX="3em">
                  ¿Estás seguro que quieras guardar?
                </Box>
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button
                    text="Cancelar"
                    color="inherit"
                    sx={{ color: '#333333', borderColor: '#333333' }}
                    onClick={handleClose}
                    variant="outlined"
                    disabled={isSaving}
                  />
                  <Button
                    text="Guardar formulario"
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    disabled={isSaving}
                    isLoading={isSaving}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <Box display="flex" justifyContent="center">
              <Box
                width="20em"
                height="35em"
                maxHeight="45em"
                borderRadius="35px"
                borderColor="#ACCCF8"
                position="relative"
                style={{
                  borderStyle: 'solid',
                  borderWidth: '7px',
                  background: '#fdfdfd'
                }}
              >
                <Box display="flex" justifyContent="center">
                  <Box
                    style={{
                      marginTop: '-2px',
                      position: 'absolute',
                      width: '210px',
                      height: '25px',
                      zIndex: 4,
                      background: '#ACCCF8',
                      borderBottomLeftRadius: '24px',
                      borderBottomRightRadius: '24px'
                    }}
                  />
                </Box>

                <Box mt="40px">
                  <Scrollbar
                    sx={{
                      height: '28em',
                      maxHeight: '38em',
                      '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
                    }}
                  >
                    <Box px={1.5} py={1}>
                      <FormControl fullWidth>
                        <Select
                          value={organizationForm?.name ?? ''}
                          defaultValue={organizationForm?.name ?? ''}
                          sx={{
                            borderRadius: '40px',
                            background: theme.palette.primary.main,
                            color: 'white',
                            '.MuiSelect-icon': { color: 'white' }
                          }}
                        >
                          <MenuItem value={organizationForm?.name}>{organizationForm?.name}</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box p={0.2} mt={2} px={1}>
                      {attributes?.map((attribute: OrganizationFormAttribute, index: number) => (
                        <Box key={`preview_attribute_${index}`} py={1}>
                          <ComponentOrganizationForm attribute={attribute} />
                        </Box>
                      ))}
                    </Box>
                  </Scrollbar>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewOrganizationForm;
