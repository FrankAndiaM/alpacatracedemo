import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Grid, Box, Typography, FormHelperText } from '@mui/material';
import Dialog from '~ui/molecules/Dialog/Dialog';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CustomButton from '~ui/atoms/Button/Button';
import { showMessage } from '~utils/Messages';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '~ui/atoms/TextField/TextField';
import UploadAvatar from '~ui/components/@material-extend/UploadAvatar';
// import SelectField from '~ui/atoms/SelectField/SelectField';
import UploadMultiFile from '~ui/components/@material-extend/UploadMultiFile';
import { uploadOrganizationFiles } from '~services/organization/profile';
import { useTheme } from '@mui/material';

type LoadFileDialogProps = {
  onClose(isUpdated?: boolean): any;
};

const LoadFileDialog: React.FC<LoadFileDialogProps> = (props: LoadFileDialogProps) => {
  //   const itemCategory = [
  //     { description: 'Personal', name: 'personal' },
  //     { description: 'Productivo', name: 'productive' },
  //     { description: 'Financiero', name: 'economic' }
  //   ];
  const { onClose } = props;
  const theme = useTheme();
  const isCompMounted = useRef(null);
  const [imageUrl, setImageURL] = useState<any[]>([]);
  const [newImage, setNewImage] = useState<any[]>([]);
  const [isImage, setIsImage] = useState(true);
  const [isLogo, setIsLogo] = useState(true);
  const [newLogo, setNewLogo] = useState<any>(undefined);
  const [logoUrl, setLogoURL] = useState<string>('');

  // validation
  const validationSchema = yup.object().shape({
    // category: yup.string().required('Campo requerido.').nullable(),
    name_data: yup.string().required('Campo requerido.').nullable()
  });

  const initialValues = {
    category: undefined,
    name_data: undefined
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values: any) => {
      const formData = new FormData();

      newImage.forEach((image: any) => {
        if (newImage !== undefined) {
          formData.append('file', image.file);
          formData.append('file_type', image.file_type);
          formData.append('file_name', image.file_name);
        }
      });

      if (newLogo !== undefined) {
        formData.append('logo', newLogo.file);
        formData.append('logo_name', newLogo.file_name);
        formData.append('logo_type', newLogo.file_type);
      }

      formData.append('category', 'personal');
      formData.append('name', values.name_data);

      uploadOrganizationFiles(formData)
        .then((res: any) => {
          const data = res.data.data;
          showMessage('', data.message ?? 'Archivo cargado.', 'success');
          onClose(true);
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
          showMessage('', 'Problemas al Subir la imagen.', 'error', true);
        });
    },
    validationSchema
  });

  const handleValidate = useCallback((): boolean => {
    let valid: boolean = true;
    if (newImage.length > 0) {
      setIsImage(true);
    } else {
      setIsImage(false);
      valid = false;
    }
    if (newLogo) {
      setIsLogo(true);
    } else {
      setIsLogo(false);
      valid = false;
    }
    return valid;
  }, [newImage.length, newLogo]);

  const onSubmit = useCallback(async () => {
    // setValidateImg((prev: boolean) => !prev);
    await formik.setErrors({});
    await formik.handleSubmit();
  }, [formik]);

  const handleRemoveAll = () => {
    setNewImage([]);
    setImageURL([]);
    setNewLogo(undefined);
    setLogoURL('');
    setIsLogo(false);
    setIsImage(false);
  };

  useEffect(() => {
    if (newLogo) {
      setIsLogo(true);
    } else {
      setIsLogo(false);
    }
  }, [newLogo]);

  useEffect(() => {
    if (newImage.length > 0) {
      setIsImage(true);
    } else {
      setIsImage(false);
    }
  }, [newImage.length]);

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

  const handleRemove = (file: File | undefined) => {
    const filteredItems = newImage.filter((_file: any) => _file.file_name !== file?.name);
    const filteredItemsImage = imageUrl.filter((_file: any) => _file !== file);
    setNewImage(filteredItems);
    setImageURL(filteredItemsImage);
  };

  const handleDrop = useCallback((acceptedFiles: any) => {
    acceptedFiles.forEach((file: File | undefined) => {
      if (file) {
        if (file.size >= 3000000) {
          showMessage('', 'El archivo es muy pesado.', 'error', true);
          return '';
        }
        const newFile = {
          file: file,
          file_name: file.name,
          file_type: file.type
        };

        setNewImage((prevValue: any[]) => [...prevValue, newFile]);
        setImageURL((prevValue: any[]) => [
          ...prevValue,
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        ]);
      }
    });
  }, []);

  //   const handleOnChangeSelect = useCallback(
  //     (value: string, name: string) => {
  //       formik.setFieldValue(value, name);
  //     },
  //     [formik]
  //   );

  return (
    <Dialog
      open
      title="Información del certificación"
      onClose={() => onClose()}
      actions={
        <>
          <Box display="flex" width={'100%'} justifyContent={'space-between'}>
            <CustomButton onClick={() => onClose()} variant="outlined" disabled={formik.isSubmitting} text="Cancelar" />
            <CustomButton
              text="Guardar"
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={() => {
                handleValidate();
                onSubmit();
              }}
              disabled={formik.isSubmitting}
              isLoading={formik.isSubmitting}
            />
          </Box>
        </>
      }
    >
      <Grid container={true} ref={isCompMounted} spacing={3}>
        {!formik.isSubmitting ? (
          <>
            <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
              <TextField
                id="name_data"
                name="name_data"
                type="text"
                label="Nombre de la certificación"
                variant="outlined"
                value={formik.values.name_data}
                onChange={formik.handleChange}
                disabled={formik.isSubmitting}
                errors={formik.errors}
                touched={formik.touched}
              />
            </Grid>
            {/* <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
              <SelectField
                id="category"
                name="category"
                label="Categoría"
                items={itemCategory}
                itemText="description"
                itemValue="name"
                value={formik.values.category ?? ''}
                onChange={handleOnChangeSelect}
                errors={formik.errors}
                touched={formik.touched}
                disabled={formik.isSubmitting}
              />
            </Grid> */}
            <Grid item={true} xs={12} sm={12} md={6} lg={6} xl={6}>
              <Typography style={{ textAlign: 'center', marginBottom: '16px', fontWeight: 700 }}>
                Subir PDF del certificado
              </Typography>
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
              {!isLogo && <FormHelperText style={{ color: theme.palette.error.main }}>Campo requerido</FormHelperText>}
            </Grid>
            <Grid item={true} xs={12} sm={12} md={6} lg={6} xl={6}>
              <Typography style={{ textAlign: 'center', marginBottom: '16px', fontWeight: 700 }}>
                Subir PDF del certificado
              </Typography>
              <UploadMultiFile
                showPreview
                maxSize={3000000}
                // maxFiles={1}
                multiple={false}
                accept={'application/pdf'}
                files={imageUrl}
                onDrop={handleDrop}
                onRemove={handleRemove}
                onRemoveAll={handleRemoveAll}
                disabled={imageUrl?.length !== 0}
              />
              {!isImage && <FormHelperText style={{ color: theme.palette.error.main }}>Campo requerido</FormHelperText>}
            </Grid>
          </>
        ) : (
          <Box p={5} width="100%" display="flex" flexDirection="row" justifyContent="center">
            <Box>
              <LinearProgress loading={true} />
            </Box>
            <Box textAlign="center" pt={1}>
              Cargando archivo
            </Box>
          </Box>
        )}
      </Grid>
    </Dialog>
  );
};

export default LoadFileDialog;
