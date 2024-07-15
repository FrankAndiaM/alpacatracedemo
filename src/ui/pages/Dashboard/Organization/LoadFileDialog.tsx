import React, { useState, useCallback, useRef } from 'react';
import { Grid, Box } from '@mui/material';
import Dialog from '~ui/molecules/Dialog/Dialog';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CustomButton from '~ui/atoms/Button/Button';
import { showMessage } from '~utils/Messages';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '~ui/atoms/TextField/TextField';
import SelectField from '~ui/atoms/SelectField/SelectField';
import UploadMultiFile from '~ui/components/@material-extend/UploadMultiFile';
import { uploadOrganizationFiles } from '~services/organization/profile';

type LoadFileDialogProps = {
  onClose(isUpdated?: boolean): any;
};

const LoadFileDialog: React.FC<LoadFileDialogProps> = (props: LoadFileDialogProps) => {
  const itemCategory = [
    { description: 'Personal', name: 'personal' },
    { description: 'Productivo', name: 'productive' },
    { description: 'Financiero', name: 'economic' }
  ];
  const { onClose } = props;
  const isCompMounted = useRef(null);
  const [imageUrl, setImageURL] = useState<any[]>([]);
  const [newImage, setNewImage] = useState<any[]>([]);

  // validation
  const validationSchema = yup.object().shape({
    category: yup.string().required('Campo requerido.').nullable(),
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
      formData.append('category', values.category);
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

  const onSubmit = useCallback(async () => {
    await formik.setErrors({});
    await formik.handleSubmit();
  }, [formik]);

  const handleRemoveAll = () => {
    setNewImage([]);
    setImageURL([]);
  };

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

  const handleOnChangeSelect = useCallback(
    (value: string, name: string) => {
      formik.setFieldValue(value, name);
    },
    [formik]
  );

  return (
    <Dialog
      open
      title="Información del documento"
      onClose={() => onClose()}
      actions={
        <>
          <CustomButton onClick={() => onClose()} variant="outlined" disabled={formik.isSubmitting} text="Cancelar" />
          <CustomButton
            text="Guardar"
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={() => onSubmit()}
            disabled={formik.isSubmitting}
            isLoading={formik.isSubmitting}
          />
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
                label="Nombre del documento"
                value={formik.values.name_data}
                onChange={formik.handleChange}
                disabled={formik.isSubmitting}
                errors={formik.errors}
                touched={formik.touched}
              />
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
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
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
              <UploadMultiFile
                showPreview
                maxSize={3000000}
                // maxFiles={1}
                // accept={'*'}
                files={imageUrl}
                onDrop={handleDrop}
                onRemove={handleRemove}
                onRemoveAll={handleRemoveAll}
                disabled={imageUrl?.length !== 0}
              />
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
