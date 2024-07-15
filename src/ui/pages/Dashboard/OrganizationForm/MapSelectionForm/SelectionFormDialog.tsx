import React, { useCallback, useState, useEffect } from 'react';
import TextField from '~ui/atoms/TextField/TextField';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { showMessage } from '~utils/Messages';
import Button from '~atoms/Button/Button';
import { Grid, Box, FormHelperText, Snackbar, Alert } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { createOfflineZone } from '~services/organization/form';
import Autocomplete from '~ui/atoms/Autocomplete/Autocomplete';
import { listAllDepartments, listAllDistrictsOfProvince, listAllProvincesOfDepartment } from '~services/department';
import MapSelection from './MapSelection';
import { useSelector } from 'react-redux';

type FormDialogProps = {
  onClose(): void;
  refreshTable: () => void;
};

const FormDialog: React.FC<FormDialogProps> = (props: FormDialogProps) => {
  const { onClose, refreshTable } = props;
  const { auth }: any = useSelector((state: any) => state);
  const [departments, setDepartments] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [isProvincesLoading, setIsProvincesLoading] = useState<boolean>(false);
  const [districts, setDistricts] = useState<any[]>([]);
  const [isDistrictsLoading, setIsDistrictsLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [coodinatesSelected, setCoodinatesSelected] = useState<any>(undefined);
  const [mapErrorMessage, setMapErrorMessage] = useState<string>('');

  const [mapCenter, setMapCenter] = useState<any[]>([]);
  const [zoomMap, setZoomMap] = useState<number>(12);

  const initialValues = {
    name: '',
    country_id: '',
    department_id: '',
    province_id: '',
    district_id: '',
    address: '',
    organization_id: '',
    southwest_point: [],
    northeast_point: []
  };
  const validationSchema = yup.object().shape({
    name: yup.string().required('Campo requerido.')
  });
  // const validationSchema = yup.object().shape({
  //   name: yup.string().required('Campo requerido.'),
  //   display_name: yup.string().required('Campo requerido.'),
  //   form_type: yup.string().required('Campo requerido.'),
  //   category: yup.string().required('Campo requerido.')
  // });

  // const handleOnSave = useCallback((value: OrganizationForm) => {
  //   return createOrganizationForm(value);
  // }, []);

  const formik = useFormik({
    initialValues,
    onSubmit: (value: any) => {
      createOfflineZone(value)
        .then(() => {
          showMessage('', 'Zona registrada correctamente.', 'success');
          refreshTable();
          onClose();
        })
        .catch((err: any) => {
          const errorMessage = 'Problemas al registrar la zona.';
          const data = err?.response?.data;
          if (data?.hasOwnProperty('error')) {
            showMessage('', data?.error?.message ?? errorMessage, 'error', true);
          } else if (data?.hasOwnProperty('errors')) {
            formik.setErrors(data.errors);
          } else {
            showMessage('', errorMessage, 'error', true);
          }
          formik.setSubmitting(false);
        });
    },
    validationSchema
  });

  const onSubmit = useCallback(async () => {
    // console.log(coodinatesSelected);

    if (!coodinatesSelected) {
      setMapErrorMessage('Seleccione una zona en el mapa');
      return;
    }
    // console.log(coodinatesSelected);
    const { lat: latsout, lng: lngsout } = coodinatesSelected._southWest;
    const { lat: latnorth, lng: lngnorth } = coodinatesSelected._northEast;
    formik.setFieldValue('northeast_point', [lngnorth, latnorth]);
    formik.setFieldValue('southwest_point', [lngsout, latsout]);
    formik.setFieldValue('organization_id', auth?.organizationTheme?.organizationId);
    // console.log(formik.values);
    await formik.setErrors({});
    formik.handleSubmit();
  }, [auth, coodinatesSelected, formik]);

  const handleListAllProvincesOfDepartment = useCallback((department_id: string) => {
    setIsProvincesLoading(true);
    listAllProvincesOfDepartment(department_id)
      .then((res: any) => {
        const data = res.data.data;
        setProvinces(data);
        setIsProvincesLoading(false);
      })
      .catch(() => {
        setIsProvincesLoading(false);
        showMessage('', 'Problemas al cargar las provincias.', 'error', true);
      });
  }, []);

  const handleOnChangeDepartment = useCallback(
    (name: string, value: any) => {
      //assign country
      const department = departments.find((dep: any) => dep?.id === value);
      if (department && department.center_point && department.center_point.coordinates) {
        const coords = department.center_point.coordinates;
        if (Array.isArray(coords) && coords.length > 0) {
          setZoomMap(8);
          setMapCenter([coords[1], coords[0]]);
        }
      }
      if (department && department.country) {
        formik.setFieldValue('country_id', department.country.id);
      }
      formik.setFieldValue(name, value);
      formik.setFieldValue('province_id', '');
      formik.setFieldValue('district_id', '');
      setProvinces([]);
      setDistricts([]);
      if (value !== null) {
        handleListAllProvincesOfDepartment(value);
      }
    },
    [departments, formik, handleListAllProvincesOfDepartment]
  );

  const handleListAllDistrictsOfProvince = useCallback((department_id: string, district_id: string) => {
    setIsDistrictsLoading(true);

    listAllDistrictsOfProvince(department_id, district_id)
      .then((res: any) => {
        const data = res.data.data;
        setDistricts(data);
        setIsDistrictsLoading(false);
      })
      .catch(() => {
        setIsDistrictsLoading(false);
        showMessage('', 'Problemas al cargar las provincias.', 'error', true);
      });
  }, []);

  const handleOnChangeProvince = useCallback(
    (name: string, value: any) => {
      const province = provinces.find((dep: any) => dep?.id === value);
      if (province && province.center_point && province.center_point.coordinates) {
        const coords = province.center_point.coordinates;
        if (Array.isArray(coords) && coords.length > 0) {
          setZoomMap(10);
          setMapCenter([coords[1], coords[0]]);
        }
      }

      formik.setFieldValue(name, value);
      formik.setFieldValue('district_id', '');
      setDistricts([]);

      if (value !== null) {
        formik.setFieldValue(name, value);
        handleListAllDistrictsOfProvince(formik?.values?.department_id || '', value);
      }
    },
    [formik, handleListAllDistrictsOfProvince, provinces]
  );

  const handleOnChangeDistrict = useCallback(
    (name: string, value: any) => {
      const district = districts.find((dep: any) => dep?.id === value);
      if (district && district.center_point && district.center_point.coordinates) {
        const coords = district.center_point.coordinates;
        if (Array.isArray(coords) && coords.length > 0) {
          setZoomMap(12);
          setMapCenter([coords[1], coords[0]]);
        }
      }
      formik.setFieldValue(name, value);
    },
    [districts, formik]
  );

  const _handleOnSelectMap = useCallback((obj: any) => {
    setMapErrorMessage('');
    setCoodinatesSelected(obj);
  }, []);

  const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowAlert(false);
  };

  const handleOpenAlert = useCallback(() => {
    setShowAlert(true);
  }, []);

  useEffect(() => {
    listAllDepartments()
      .then((res: any) => {
        const data = res?.data?.data;
        setDepartments(data);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar los departamentos.', 'error', true);
      });
  }, []);

  return (
    <Dialog
      open
      title="Selecciona la ubicación"
      subtitle=""
      onClose={() => onClose()}
      actions={
        <>
          <Button onClick={() => onClose()} variant="outlined" disabled={formik.isSubmitting} text="Cancelar" />
          <Button
            onClick={() => onSubmit()}
            color="primary"
            variant="contained"
            disabled={formik.isSubmitting}
            isLoading={formik.isSubmitting}
            text="Registrar"
          />
        </>
      }
    >
      <Grid container={true} spacing={1}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            id="name"
            name="name"
            type="text"
            label="Nombre de mapa"
            value={formik.values.name}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            touched={formik.touched}
            autoComplete={'off'}
            inputProps={{
              maxLength: 400,
              autoComplete: 'off'
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <Autocomplete
            id="department_id"
            name="department_id"
            label="Departamento"
            items={departments}
            onChange={handleOnChangeDepartment}
            value={formik.values.department_id}
            selectedValue={formik.values.department_id}
            defaultValue={null}
            itemText="description"
            itemValue="id"
            disabled={formik.isSubmitting}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <Autocomplete
            id="province_id"
            name="province_id"
            label="Provincia"
            items={provinces}
            isDataLoading={isProvincesLoading}
            onChange={handleOnChangeProvince}
            value={formik.values.province_id}
            selectedValue={formik.values.province_id}
            defaultValue={null}
            itemText="description"
            itemValue="id"
            disabled={formik.isSubmitting}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <Autocomplete
            id="district_id"
            name="district_id"
            label="Distrito"
            items={districts}
            isDataLoading={isDistrictsLoading}
            onChange={handleOnChangeDistrict}
            value={formik.values.district_id}
            selectedValue={formik.values.district_id}
            defaultValue={null}
            itemText="description"
            itemValue="id"
            disabled={formik.isSubmitting}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <Box pt={'8px'}>
            <TextField
              id="address"
              name="address"
              type="text"
              label="Referencia"
              value={formik.values.address}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              errors={formik.errors}
              touched={formik.touched}
              inputProps={{
                maxLength: 400
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <MapSelection
            onSelectMap={_handleOnSelectMap}
            zoomMap={zoomMap}
            center={mapCenter}
            handleOpenAlert={handleOpenAlert}
          />
          <FormHelperText id="component-error-text" error>
            {mapErrorMessage}
          </FormHelperText>
        </Grid>
      </Grid>
      <Snackbar open={showAlert} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
          ¡El mapa excede el límite permitido!
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default FormDialog;
