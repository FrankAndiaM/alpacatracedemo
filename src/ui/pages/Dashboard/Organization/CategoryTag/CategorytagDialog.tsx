import React, { useCallback, useEffect } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Grid, Box } from '@mui/material';
import TextField from '~ui/atoms/TextField/TextField';
import Button from '~atoms/Button/Button';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { showMessage } from '~/utils/Messages';
import { CategoryTag } from '~models/categoryTag';
import Radio from '~ui/atoms/radioButton';

type CategoryDialogProps = {
  open: boolean;
  category: CategoryTag;
  onClose(updateTable?: boolean): void;
  onSave(values: CategoryTag): Promise<any>;
};

const CategoryDialog: React.FC<CategoryDialogProps> = (props: CategoryDialogProps) => {
  const { open, category, onClose, onSave }: CategoryDialogProps = props;
  const [selectedValue, setSelectedValue] = React.useState('#00AB55');

  // validation
  const validationSchema = yup.object().shape({
    display_name: yup.string().required('El campo es requerido')
  });

  const formik = useFormik({
    initialValues: category,
    onSubmit: (category: CategoryTag) => {
      handleSave(category);
    },
    validationSchema
  });

  const handleSave = useCallback(
    (category: CategoryTag) => {
      onSave(category)
        .then((res: any) => {
          const { message } = res.data;
          showMessage('', message, 'success');
          formik.setSubmitting(false);
          onClose(true);
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
    [onSave, onClose, formik]
  );

  const onSubmit = useCallback(async () => {
    await formik.setErrors({});
    formik.handleSubmit();
  }, [formik]);

  const handleChange = (event: any) => {
    setSelectedValue(event.target.value);
    formik.setFieldValue('color', event.target.value);
  };

  useEffect(() => {
    category?.id !== '-1' && setSelectedValue(category.color);
  }, [category]);

  const Colors = ['#00AB55', '#EFB034', '#D04444', '#AC44D0', '#50A8D9', '#7A7070'];

  return (
    <Dialog
      open={open}
      title={'Información de la categoría'}
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
            text={category.id !== '-1' ? 'Guardar' : 'Registrar'}
          />
        </>
      }
    >
      <Grid container={true} spacing={3}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            id="display_name"
            name="display_name"
            type="text"
            label="Nombre de la categoría"
            value={formik.values.display_name}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            touched={formik.touched}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            id="description"
            name="description"
            type="text"
            label="Descripción"
            value={formik.values.description}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            touched={formik.touched}
          />
        </Grid>
        <Grid container item={true} xs={12} sm={12} md={12} lg={12} xl={12} flexDirection="row">
          {Colors.map((color: string, index: number) => (
            <Grid key={`color-${index}`} container item={true} xs={3} sm={3} md={4} lg={4} xl={4} flexDirection="row">
              <Radio
                label={
                  <Box
                    display="inline-flex"
                    mx={'4px'}
                    px={1}
                    py={'4px'}
                    borderRadius="15px"
                    color="#fff"
                    style={{ background: color }}
                  >
                    Color
                  </Box>
                }
                checkedSelect={selectedValue}
                onChange={handleChange}
                value={color}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default React.memo(CategoryDialog);
