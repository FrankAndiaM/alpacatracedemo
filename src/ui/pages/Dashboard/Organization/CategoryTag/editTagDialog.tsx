import React, { useCallback } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Grid, Box } from '@mui/material';
import TextField from '~ui/atoms/TextField/TextField';
import Button from '~atoms/Button/Button';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { showMessage } from '~/utils/Messages';
import { Tag } from '~models/categoryTag';

type CategoryDialogProps = {
  open: boolean;
  tag: Tag;
  onClose(updateTable?: boolean): void;
  onSave(values: Tag): Promise<any>;
  setTags: any;
};

const CropDialog: React.FC<CategoryDialogProps> = (props: CategoryDialogProps) => {
  const { open, tag, onClose, onSave, setTags }: CategoryDialogProps = props;

  // validation
  const validationSchema = yup.object().shape({
    display_name: yup.string().required('El nombre de la etiqueta es requerido')
  });

  const tagsValues: any = {
    id: tag.id,
    display_name: tag.display_name
  };
  const formik = useFormik({
    initialValues: tagsValues,
    onSubmit: (tag: any) => {
      handleSave(tag);
    },
    validationSchema
  });

  const handleSave = useCallback(
    (tag: any) => {
      onSave(tag)
        .then((res: any) => {
          const { message } = res.data;
          showMessage('', message, 'success');
          formik.setSubmitting(false);

          setTags((preValue: Tag[]) => {
            return preValue.map((item: Tag) => {
              if (item.id === tag.id) {
                item.display_name = formik.values.display_name;
              }
              return item;
            });
          });
          onClose(false);
        })
        .catch((err: any) => {
          const { data } = err.response;
          if (data?.status && data?.error?.message) {
            showMessage('', data?.error?.message, data.status, data.status === 'error' ? true : false);
          } else {
            showMessage('', 'Problemas al registrar.', 'error', true);
          }
          formik.setSubmitting(false);
        });
    },
    [onSave, formik, setTags, onClose]
  );

  const onSubmit = useCallback(async () => {
    await formik.setErrors({});

    formik.handleSubmit();
  }, [formik]);

  return (
    <Dialog
      open={open}
      title="Edición de etiqueta"
      onClose={onClose}
      actions={
        <>
          <Button
            text="Cancelar"
            onClick={() => {
              onClose(false);
            }}
            variant="outlined"
            disabled={formik.isSubmitting}
          />
          <Button
            onClick={() => onSubmit()}
            disabled={formik.isSubmitting}
            isLoading={formik.isSubmitting}
            variant="outlined"
            text={'Guardar'}
          />
        </>
      }
    >
      <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
        <Box fontWeight={500} fontSize="1.2em" mb={3}>
          Creación de etiquetas
        </Box>
      </Grid>
      <Grid container={true} spacing={3}>
        <Grid
          item={true}
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
        >
          <Box width="430px">
            <TextField
              id={tag.id}
              name="display_name"
              type="text"
              label="Nombre de la etiqueta"
              value={formik.values.display_name}
              disabled={formik.isSubmitting}
              onChange={formik.handleChange}
              errors={formik?.errors}
              touched={formik?.touched}
            />
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default React.memo(CropDialog);
