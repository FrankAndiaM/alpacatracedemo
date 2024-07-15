import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Box, Card, Typography, Snackbar, useMediaQuery, IconButton, InputAdornment } from '@mui/material';
import Button from '~ui/atoms/Button/Button';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { showMessage, showYesNoQuestion } from '~utils/Messages';
import { useTheme } from '@mui/material/styles';
import { updateOrganizationVisorTheme } from '~services/organization/profile';
// import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { useSelector } from 'react-redux';
import { ContentCopy } from '@mui/icons-material';
import TextField from '~ui/atoms/TextField/TextField';
// import UploadAvatar from '~ui/components/@material-extend/UploadAvatar';
import UploadImage from './components/UploadImage';
// import { isString } from 'lodash';
import ImageViewer from './components/ImageViewer';
import { COMMUNITY_BASE_URL_S3, HOST_VISOR } from '~config/environment';
import { inputRemoveAllASCII } from '~utils/inputs';
// import { VISOR_BASE_URL } from '~config/environment';

type VisorConfigProps = unknown;

const VisorConfig: React.FC<VisorConfigProps> = () => {
  const themes = useTheme();
  const isActiveDesktop = useMediaQuery(themes.breakpoints.down('md'));
  const { auth }: any = useSelector((state: any) => state);
  // validation
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openSnack, setOpenSnack] = useState<boolean>(false);

  const [logoUrl, setLogoURL] = useState<string>('');
  const [newLogo, setNewLogo] = useState<any>(undefined);

  const [logoBackUrl, setLogoBackURL] = useState<string>('');
  const [newLogoBack, setNewLogoBack] = useState<any>(undefined);

  const initialValues = {
    custom_url_path: '',
    background_path: '',
    description: '',
    logo_white: ''
  };

  const validationSchema = yup.object().shape({
    custom_url_path: yup.string().max(50, 'Máximo 50 caracteres'),
    description: yup.string().max(250, 'Máximo 250 caracteres')
  });

  const formik = useFormik({
    initialValues,
    onSubmit: (values: any) => {
      // console.log(values);
      const formData = new FormData();
      if (newLogo !== undefined) {
        formData.append('logo_white', newLogo.file);
        // formData.append('logo_name', newLogo.file_name);
        // formData.append('logo_type', newLogo.file_type);
      }
      if (newLogoBack !== undefined) {
        formData.append('background_path', newLogoBack.file);
        // formData.append('logo_name', newLogo.file_name);
        // formData.append('logo_type', newLogo.file_type);
      }
      formData.append('description', values.description);
      formData.append('custom_url_path', values.custom_url_path);

      updateOrganizationVisorTheme(formData)
        .then((res: any) => {
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
          showMessage('', 'Problemas al actualizar la configuración del visor.', 'error', true);
        });
    },
    validationSchema
  });

  const onSubmit = useCallback(async () => {
    await formik.setErrors({});
    showYesNoQuestion(
      '',
      'Se actualizara la información de su visor de trazabilidad, ¿esta seguro de guardar los cambios?',
      'info',
      false
    ).then((val: any) => {
      if (val) {
        formik.handleSubmit();
      }
    });
  }, [formik]);

  const handleCloseSnack = useCallback(() => {
    setOpenSnack((prev: boolean) => !prev);
  }, []);

  const handleCopyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(`${text}`);
    setOpenSnack(true);
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
  const handleDropLogoBack = useCallback((acceptedFiles: any) => {
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
      setNewLogoBack(newFile);
      setLogoBackURL(URL.createObjectURL(file));
    }
  }, []);

  const handleOnChangeUsernameInput = useCallback(
    (event: any) => {
      const { name, value } = event.target;
      if (`${value}`.length < 50) {
        formik.setFieldValue(name, inputRemoveAllASCII(value)?.toLowerCase());
      }
    },
    [formik]
  );

  useEffect(() => {
    formik.setFieldValue('custom_url_path', auth?.organizationTheme?.theme?.custom_url_path ?? '');
    formik.setFieldValue('description', auth?.organizationTheme?.theme?.description ?? '');
    // formik.setValues({
    //   custom_url_path: auth?.organizationTheme?.theme?.custom_url_path ?? '',
    //   // background_path: COMMUNITY_BASE_URL_S3 + auth?.organizationTheme?.theme?.background_path ?? '',
    //   description: auth?.organizationTheme?.theme?.description ?? ''
    //   // logo_white: COMMUNITY_BASE_URL_S3 + auth?.organizationTheme?.theme?.logos?.logo_white ?? ''
    // });
    if (auth?.organizationTheme?.theme?.background_path) {
      setLogoBackURL(COMMUNITY_BASE_URL_S3 + auth?.organizationTheme?.theme?.background_path);
      formik.setFieldValue('background_path', COMMUNITY_BASE_URL_S3 + auth?.organizationTheme?.theme?.background_path);
    }
    if (auth?.organizationTheme?.theme?.logos?.logo_white) {
      setLogoURL(COMMUNITY_BASE_URL_S3 + auth?.organizationTheme?.theme?.logos?.logo_white);
      formik.setFieldValue('logo_white', COMMUNITY_BASE_URL_S3 + auth?.organizationTheme?.theme?.logos?.logo_white);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  return (
    <Box mt={2}>
      {/* <Box my={1}>
        <LinearProgress loading={isLoading} />
      </Box> */}
      {/* <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}> */}
      <Card sx={{ padding: '32px', color: '#09304F' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography variant="h5">Link del visor de trazabilidad</Typography>
            <Box display="flex">
              <TextField
                id="custom_url_path"
                name="custom_url_path"
                type="text"
                variant="outlined"
                label=""
                value={formik.values.custom_url_path}
                onChange={handleOnChangeUsernameInput}
                disabled={formik.isSubmitting}
                errors={formik.errors}
                touched={formik.touched}
                size="small"
                InputProps={
                  !isActiveDesktop
                    ? {
                        startAdornment: <InputAdornment position="start">{HOST_VISOR}</InputAdornment>
                        // style: { paddingLeft: 0 },
                      }
                    : {}
                }
                inputProps={{
                  style: { paddingLeft: isActiveDesktop ? 8 : 0 }
                }}
              />

              <IconButton onClick={() => handleCopyToClipboard(HOST_VISOR + formik.values.custom_url_path)}>
                <ContentCopy />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography variant="h5">Descripción para visor de trazabilidad</Typography>
            <Box display="flex">
              <TextField
                id="description"
                name="description"
                type="text"
                variant="outlined"
                label=""
                value={formik.values.description}
                onChange={formik.handleChange}
                disabled={formik.isSubmitting}
                errors={formik.errors}
                touched={formik.touched}
                multiline
                rowsMax={2}
                size="small"
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6">Foto de visor trazabilidad</Typography>
            <Box sx={{ width: { xs: '100%', md: '80%' }, textAlign: 'center' }}>
              <UploadImage
                disabled={formik.isSubmitting}
                accept="image/*"
                file={null}
                onDrop={handleDropLogoBack}
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
                    Agrega una foto arrastrándola o <br />
                    haciendo clic en el icono.
                  </Typography>
                }
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6">Vista previa de la imagen</Typography>
            <ImageViewer url={logoBackUrl} />
            {/* <Box
              sx={{
                width: '406px',
                padding: '8px'
              }}
            >
              {logoBackUrl && (
                <Box
                  component="img"
                  alt="logo"
                  src={isString(logoBackUrl) ? logoBackUrl : ''}
                  sx={{ zIndex: 8, objectFit: 'cover', height: '224px', width: '100%', borderRadius: '1%' }}
                />
              )}
            </Box> */}
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6} textAlign={'center'}>
            <Typography variant="h6">Logo de visor trazabilidad</Typography>
            <UploadImage
              disabled={formik.isSubmitting}
              accept="image/*"
              file={null}
              isRounded
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
                  Agrega una foto de la marca <br />
                  formato png
                </Typography>
              }
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6">Vista previa de la imagen</Typography>
            <ImageViewer url={logoUrl} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                text="Guardar cambios"
                variant="contained"
                disabled={formik.isSubmitting}
                onClick={() => onSubmit()}
                isLoading={formik.isSubmitting}
              />
            </Box>
          </Grid>
        </Grid>
      </Card>
      {/* </Grid>
      </Grid> */}
      {
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openSnack}
          onClose={handleCloseSnack}
          message="Copiado correctamente"
          key={'copy-snackbar'}
          autoHideDuration={1000}
        />
      }
    </Box>
  );
};

export default React.memo(VisorConfig);
