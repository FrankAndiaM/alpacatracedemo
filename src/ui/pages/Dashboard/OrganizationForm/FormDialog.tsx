import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '~ui/atoms/TextField/TextField';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { OrganizationForm } from '~models/organizationForm';
import { showMessage } from '~utils/Messages';
import Button from '~atoms/Button/Button';
import { Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
// import { createOrganizationForm } from '~services/organization/form';
import SelectField from '~ui/atoms/SelectField/SelectField';
// import { inputRemoveAllASCII } from '~utils/inputs';
import routes from '~routes/routes';
import { createForm } from '~services/organization/formsv2';
import { useSelector } from 'react-redux';

// const categories = [
//   // { id: undefined, description: 'Seleccionar categoría de formulario' },
//   { id: 'personal', description: 'Información personal' },
//   { id: 'productive', description: 'Información productiva' },
//   { id: 'economic', description: 'Información económica' }
// ];

type FormDialogProps = {
  onClose(): void;
};

//const formTypes: any[] = [
// { id: undefined, description: 'Seleccionar tipo de formulario' },
//  { name: 'general', description: 'Información general' },
//  { name: 'farm', description: 'Información de unidad productiva' },
//  { name: 'organization', description: 'Información de organización' }
//];

// const entityTypes: any[] = [
//   // { id: undefined, description: 'Seleccionar tipo de usuario' },
//   { name: 'Producers', description: 'Productores' },
//   { name: 'Free', description: 'Organización' }
// ];

// const formTypes: any[] = [
//   // { id: undefined, description: 'Seleccionar tipo de formulario' },
//   { name: 'general', description: 'Información general' },
//   { name: 'farm', description: 'Información de unidad productiva' }
// ];

const entityTypes: any[] = [
  // { id: undefined, description: 'Seleccionar tipo de usuario' },
  { name: 'PRODUCER', description: 'Información general' },
  { name: 'PRODUCTIVE_UNIT', description: 'Información de unidad productiva' },
  { name: 'FREE', description: 'Información de organización' }
];

const FormDialog: React.FC<FormDialogProps> = (props: FormDialogProps) => {
  const history = useNavigate();
  const { onClose } = props;
  const { auth }: any = useSelector((state: any) => state);

  const initialValues: OrganizationForm = {
    name: '',
    description: '',
    // display_name: '',
    // category: undefined,
    owner_model_id: auth?.organizationTheme?.organizationId,
    owner_model_type: 'Organizations',
    entry_entity_type: undefined
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required('Campo requerido.'),
    // display_name: yup.string().required('Campo requerido.'),
    // category: yup.string().required('Campo requerido.'),
    entry_entity_type: yup.string().required('Campo requerido')
  });

  const handleOnSave = useCallback((value: OrganizationForm) => {
    return createForm(value);
  }, []);

  const formik = useFormik({
    initialValues,
    onSubmit: (value: OrganizationForm) => {
      handleOnSave(value)
        .then((res: any) => {
          const { id, message } = res?.data?.data;
          showMessage('', message, 'success');
          history(`${routes.organizationForm}/${id}`);
        })
        .catch((err: any) => {
          const errorMessage = 'Problemas al rechazar el certificado.';
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
    await formik.setErrors({});
    formik.handleSubmit();
  }, [formik]);

  const handleOnChangeTextField = useCallback(
    (event: any) => {
      const { name, value } = event.target;
      formik.setFieldValue(name, value);
      // formik.setFieldValue(name, inputRemoveAllASCII(value)?.toLowerCase());
    },
    [formik]
  );

  const handleOnChangeSelectField = useCallback(
    (name: any, value: any) => {
      formik.setFieldValue(name, value);
    },
    [formik]
  );

  return (
    <Dialog
      open
      title="Crear formulario"
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
      <Grid container={true}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            id="name"
            name="name"
            type="text"
            label="Nombre del formulario *"
            value={formik.values.name}
            onChange={handleOnChangeTextField}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            touched={formik.touched}
            inputProps={{
              maxLength: 251
            }}
          />
        </Grid>
        {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <SelectField
            id="form_type"
            name="form_type"
            label="Tipo de formulario *"
            value={typeSelected}
            items={formTypes}
            itemText="description"
            itemValue="name"
            onChange={handleOnChangeFormType}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            touched={formik.touched}
          />
        </Grid> */}
        {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <SelectField
            id="category"
            name="category"
            label="Categoría de formulario *"
            value={formik.values.category}
            items={categories}
            itemText="description"
            itemValue="id"
            onChange={handleOnChangeSelectField}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            touched={formik.touched}
          />
        </Grid> */}
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <SelectField
            id="entry_entity_type"
            name="entry_entity_type"
            label="Tipo de formulario *"
            value={formik.values.entry_entity_type}
            items={entityTypes}
            itemText="description"
            itemValue="name"
            onChange={handleOnChangeSelectField}
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
            rowsMax={4}
            touched={formik.touched}
            multiline
            inputProps={{
              maxLength: 250
            }}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default FormDialog;
