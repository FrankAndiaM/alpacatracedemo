import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Box, Card, Typography, Switch, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Button from '~ui/atoms/Button/Button';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { showMessage, showYesNoQuestion } from '~utils/Messages';
import { updateOrganizationTheme } from '~services/organization/profile';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { useSelector } from 'react-redux';

type ConfigurationTabProps = unknown;

const ConfigurationTab: React.FC<ConfigurationTabProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { auth }: any = useSelector((state: any) => state);
  // validation
  const validationSchema = yup.object().shape({});

  const initialValues = {
    show_product: true,
    name_product: 'Panel'
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values: any) => {
      // const formData = new FormData();
      // formData.append('show_product', values.ruc);
      // formData.append('name_product', values.name);
      updateOrganizationTheme(values.name_product, values.show_product)
        .then(() => {
          formik.setSubmitting(false);
          // const data = res?.data?.data;
          // if (data?.message !== undefined) {
          //   showMessage('', data?.message, 'success');
          //   return;
          // }
          showYesNoQuestion(
            '',
            'La configuración fue actualizada, deberá actualizar la página o volver a iniciar sesión para ver los cambios.',
            'success',
            false,
            ['Actualizar luego', 'Actualizar ahora']
          ).then((val: any) => {
            if (val) {
              window.location.reload();
            }
          });
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

  useEffect(() => {
    setIsLoading(true);
    formik.setFieldValue('show_product', Boolean(auth?.organizationTheme?.show_product));
    formik.setFieldValue('name_product', auth?.organizationTheme?.name_product || 'Panel');
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.organizationTheme]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      formik.setFieldValue('show_product', (event.target as HTMLInputElement).checked);
    },
    [formik]
  );

  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('name_product', (event.target as HTMLInputElement).value);
  };

  return (
    <Box mt={2}>
      <Box my={1}>
        <LinearProgress loading={isLoading} />
      </Box>
      {/* <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}> */}
      <Card sx={{ padding: '32px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <Typography fontSize={20} fontWeight={600}>
              Opciones de producto intermedio
            </Typography>
            <Typography fontSize={18} fontWeight={500} my={2}>
              ¿Deseas activar el producto intermedio?
            </Typography>
            <Typography fontSize={14} fontWeight={500}>
              Esto generara que el producto intermedio no se pueda utilizar hasta que usted lo vuelva a activar.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4} xl={4} display={'flex'} alignItems={'center'}>
            <Switch
              checked={formik.values.show_product}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
              size="medium"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography fontSize={18} fontWeight={500}>
              Cambiar el nombre del producto intermedio
            </Typography>
            <FormControl disabled={!formik.values.show_product}>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={formik.values.name_product}
                onChange={handleChangeRadio}
              >
                <FormControlLabel value="Panel" control={<Radio />} label="Panel" />
                <FormControlLabel value="Paño" control={<Radio />} label="Paño" />
                <FormControlLabel value="Tejido" control={<Radio />} label="Tejido" />
                <FormControlLabel value="Pieza" control={<Radio />} label="Pieza" />
              </RadioGroup>
            </FormControl>
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
      {/* </Grid>
      </Grid> */}
    </Box>
  );
};

export default ConfigurationTab;
