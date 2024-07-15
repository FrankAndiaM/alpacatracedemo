import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Box, Card, Typography } from '@mui/material';
import Button from '~ui/atoms/Button/Button';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '~ui/atoms/TextField/TextField';
import Autocomplete from '~ui/atoms/Autocomplete/Autocomplete';
import { listAllDepartments, listAllDistrictsOfProvince, listAllProvincesOfDepartment } from '~services/department';
import { showMessage } from '~utils/Messages';
import { getOrganizationProfile, updateOrganizationProfile } from '~services/organization/profile';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import UploadAvatar from '~ui/components/@material-extend/UploadAvatar';
import { COMMUNITY_BASE_URL_S3 } from '~config/environment';

type InformationTabProps = unknown;

const InformationTab: React.FC<InformationTabProps> = () => {
  const [refreshDepartment, setRefreshDepartment] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newLogo, setNewLogo] = useState<any>(undefined);
  const [logoUrl, setLogoURL] = useState<string>('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [isProvincesLoading, setIsProvincesLoading] = useState<boolean>(false);
  const [districts, setDistricts] = useState<any[]>([]);
  const [isDistrictsLoading, setIsDistrictsLoading] = useState<boolean>(false);

  // validation
  const validationSchema = yup.object().shape({});

  const initialValues = {
    ruc: '',
    name: '',
    business_name: '',
    country_id: '',
    department_id: '',
    province_id: '',
    district_id: '',
    address: '',
    description: ''
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values: any) => {
      const formData = new FormData();
      if (newLogo !== undefined) {
        formData.append('logo', newLogo.file);
        formData.append('logo_name', newLogo.file_name);
        formData.append('logo_type', newLogo.file_type);
      }
      formData.append('ruc', values.ruc);
      formData.append('name', values.name);
      formData.append('business_name', values.business_name);
      formData.append('country_id', values.country_id);
      formData.append('department_id', values.department_id);
      formData.append('province_id', values.province_id);
      formData.append('district_id', values.district_id);
      formData.append('address', values.address);
      formData.append('description', values.description);
      updateOrganizationProfile(formData)
        .then((res: any) => {
          setNewLogo(undefined);
          formik.setSubmitting(false);
          const data = res?.data?.data;
          if (data?.message !== undefined) {
            showMessage('', data?.message, 'success');
            return;
          }
          showMessage('', 'Perfil actualizado.', 'success');
        })
        .catch((err: any) => {
          formik.setSubmitting(false);
          const data = err?.response?.data;
          if (data?.hasOwnProperty('errors')) {
            const errors = {};
            Object.keys(data?.errors)?.forEach((key: any) => {
              // eslint-disable-next-line
              //@ts-ignore
              errors[key] = data.errors[key] || '';
            });
            formik.setErrors(errors);
          }
          if (data?.error?.message !== undefined) {
            showMessage('', data?.error?.message, 'error', true);
            return;
          }
          if (data?.message !== undefined) {
            showMessage('', data?.message, 'error', true);
            return;
          }
          showMessage('', 'Problemas al actualizar el perfil.', 'error', true);
        });
    },
    validationSchema
  });

  const onSubmit = useCallback(async () => {
    await formik.setErrors({});
    formik.handleSubmit();
  }, [formik]);

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
      formik.setFieldValue(name, value);
      formik.setFieldValue('province_id', '');
      formik.setFieldValue('district_id', '');
      setProvinces([]);
      setDistricts([]);

      if (value !== null) {
        handleListAllProvincesOfDepartment(value);
      }
    },
    [formik, handleListAllProvincesOfDepartment]
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
      formik.setFieldValue(name, value);
      formik.setFieldValue('district_id', '');
      setDistricts([]);

      if (value !== null) {
        formik.setFieldValue(name, value);
        handleListAllDistrictsOfProvince(formik?.values?.department_id || '', value);
      }
    },
    [formik, handleListAllDistrictsOfProvince]
  );

  const handleOnChangeDistrict = useCallback(
    (name: string, value: any) => {
      formik.setFieldValue(name, value);
    },
    [formik]
  );

  useEffect(() => {
    listAllDepartments()
      .then(async (res: any) => {
        const data = res?.data?.data;
        await setDepartments(data);
        getOrganizationProfile()
          .then((res: any) => {
            const profileData = res?.data?.data;
            formik.setFieldValue('ruc', profileData.ruc);
            formik.setFieldValue('name', profileData.name);
            formik.setFieldValue('business_name', profileData.business_name);
            formik.setFieldValue('address', profileData.address);
            formik.setFieldValue('description', profileData.description);
            if (profileData.logo_path !== null && profileData.logo_path !== '') {
              setLogoURL(COMMUNITY_BASE_URL_S3 + profileData.logo_path);
            }

            if (
              profileData?.department_id !== '' &&
              profileData?.department_id !== null &&
              profileData?.department_id !== undefined
            ) {
              formik.setFieldValue('department_id', profileData?.department_id);
              setRefreshDepartment((prevValue: boolean) => !prevValue);
              if (
                profileData?.province_id !== '' &&
                profileData?.province_id !== null &&
                profileData?.province_id !== undefined
              ) {
                formik.setFieldValue('province_id', profileData?.province_id);
                handleListAllProvincesOfDepartment(profileData?.department_id);
                if (
                  profileData?.district_id !== '' &&
                  profileData?.district_id !== null &&
                  profileData?.district_id !== undefined
                ) {
                  formik.setFieldValue('district_id', profileData?.district_id);
                  handleListAllDistrictsOfProvince(profileData?.department_id, profileData?.province_id);
                }
              }
            }
            setIsLoading(false);
          })
          .catch(() => {
            showMessage('', 'Problemas al cargar el perfil de la organización', 'error', true);
          });
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar los departamentos.', 'error', true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDropLogo = useCallback((acceptedFiles: any) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size >= 3000000) {
        showMessage('', 'El archivo es muy pesado.', 'error', true);
        return;
      }
      const newFile = {
        file: file,
        file_name: file.name,
        file_type: file.type
      };
      setNewLogo(newFile);
      setLogoURL(URL.createObjectURL(file));
    }
  }, []);

  return (
    <Box mt={2}>
      <Box my={1}>
        <LinearProgress loading={isLoading} />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center', height: '100% ' }}>
            <Box display="flex" flexDirection="column" justifyContent="center" height="100% " alignItems="center">
              <Box fontWeight={500}>Logo de la</Box>
              <Box fontWeight={500} mb={2}>
                Organización
              </Box>
              <UploadAvatar
                disabled={formik.isSubmitting}
                accept="image/*"
                file={logoUrl}
                onDrop={handleDropLogo}
                caption={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    Formato *.jpeg, *.jpg, *.png
                    <br /> Tamaño máximo 3MB
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
          <Card sx={{ padding: '10px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <TextField
                  id="ruc"
                  name="ruc"
                  type="text"
                  label="RUC"
                  value={formik.values.ruc}
                  onChange={formik.handleChange}
                  disabled={true}
                  errors={formik.errors}
                  touched={formik.touched}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <TextField
                  id="business_name"
                  name="business_name"
                  type="text"
                  label="Razón social"
                  value={formik.values.business_name}
                  onChange={formik.handleChange}
                  disabled={true}
                  errors={formik.errors}
                  touched={formik.touched}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextField
                  id="name"
                  name="name"
                  type="text"
                  label="Nombre de la Organización"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  disabled={true}
                  errors={formik.errors}
                  touched={formik.touched}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
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
                  refresh={refreshDepartment}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
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
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
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
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <TextField
                  id="address"
                  name="address"
                  type="text"
                  label="Dirección/Caserio"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  disabled={formik.isSubmitting}
                  errors={formik.errors}
                  touched={formik.touched}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextField
                  id="description"
                  name="description"
                  type="text"
                  label=""
                  placeholder="Descripción sobre la actividad de la organización"
                  multiline
                  rowsMax={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  disabled={formik.isSubmitting}
                  errors={formik.errors}
                  touched={formik.touched}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    text="Guardar cambios"
                    variant="contained"
                    disabled={isLoading || formik.isSubmitting}
                    onClick={() => onSubmit()}
                    isLoading={formik.isSubmitting}
                  />
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InformationTab;
