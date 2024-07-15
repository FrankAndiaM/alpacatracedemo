import React, { useCallback, useState } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Grid, Icon, Box } from '@mui/material';
import TextField from '~ui/atoms/TextField/TextField';
import Button from '~atoms/Button/Button';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { showMessage } from '~/utils/Messages';
import { CategoryTag, TagUpdate, Tag } from '~models/categoryTag';
import { capitalize } from '~utils/Word';

type CategoryDialogProps = {
  open: boolean;
  category: CategoryTag;
  onClose(updateTable?: boolean): void;
  onSave(values: TagUpdate): Promise<any>;
};

const CropDialog: React.FC<CategoryDialogProps> = (props: CategoryDialogProps) => {
  const { open, category, onClose, onSave }: CategoryDialogProps = props;
  const [tags, setTags] = useState<Tag[]>([]);
  const [index, setIndex] = useState<number>(0);

  // validation
  const validationSchema = yup.object().shape({
    tags: yup
      .array()
      .of(
        yup.object().shape({
          display_name: yup.string().required('El nombre de la etiqueta es requerido')
        })
      )
      .required('Debe agregar al menos una etiqueta')
  });

  const tagsValues: TagUpdate = {
    category_tag_id: category.id,
    tags: []
  };
  const formik = useFormik({
    initialValues: tagsValues,
    onSubmit: (category: TagUpdate) => {
      handleSave(category);
    },
    validationSchema
  });

  const handleSave = useCallback(
    (category: TagUpdate) => {
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
            showMessage('', data?.error?.message, data.code, data.status === 'error' ? true : false);
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
    const { value, id } = event.target;

    setTags((tags: Tag[]) => {
      const newTags = tags.map((tag: Tag) => {
        if (tag.id === id) {
          tag.display_name = value;
        }

        return tag;
      });
      formik.setFieldValue('tags', newTags);

      return newTags;
    });
  };

  const handleAddChange = () => {
    setTags((tags: Tag[]) => {
      const tag = {
        id: 'index-' + index,
        display_name: ''
      };
      setIndex(index + 1);
      formik.setFieldValue('tags', [...tags, tag]);
      formik.setTouched({});
      return [...tags, tag];
    });
  };

  const handleARemoveChange = (index: string) => {
    setTags((tags: Tag[]) => {
      const newTags = tags.filter((tag: Tag) => index !== tag.id);
      formik.setFieldValue('tags', newTags);
      return newTags;
    });
  };

  return (
    <Dialog
      open={open}
      title={`Categoría: ${capitalize(category.display_name)}`}
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
      <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
        <Box fontWeight={500} fontSize="1.2em" mb={3}>
          Creación de etiquetas
        </Box>
      </Grid>
      <Grid container={true} spacing={3}>
        {tags.map((tag: Tag, index: number) => (
          <Grid
            key={`tag-${index}`}
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
                value={tag.display_name}
                onChange={handleChange}
                disabled={formik.isSubmitting}
                errors={formik?.errors?.tags?.[index]}
                touched={formik?.touched?.tags?.[index]}
              />
            </Box>
            <Box width="70px" display="flex" justifyContent="center" alignItems="center">
              <Icon
                onClick={() => {
                  handleARemoveChange(tag.id);
                }}
                style={{ fontSize: 24, fontWeight: 500, color: '#FF4842', cursor: 'pointer' }}
              >
                delete
              </Icon>
            </Box>
          </Grid>
        ))}
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Button
            onClick={handleAddChange}
            variant="contained"
            text="Agregar etiqueta"
            startIcon={<Icon style={{ fontSize: 15, fontWeight: 500, marginTop: 1 }}>add</Icon>}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default React.memo(CropDialog);
