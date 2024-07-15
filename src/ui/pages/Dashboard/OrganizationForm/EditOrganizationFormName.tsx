import React, { useCallback } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '~ui/atoms/TextField/TextField';
import Button from '~ui/atoms/Button/Button';
import { showMessage, showYesNoQuestion } from '~utils/Messages';
import { OrganizationForm } from '~models/organizationForm';
// import { inputRemoveAllASCII } from '~utils/inputs';
// import { updateOrganizationForm } from '~services/organization/form';
import { updateForm } from '~services/organization/formsv2';
import { useSelector } from 'react-redux';

type EditOrganizationFormNameProps = {
  organizationForm: OrganizationForm;
  onClose(isUpdateTable?: boolean): void;
};

const EditOrganizationFormName: React.FC<EditOrganizationFormNameProps> = (props: EditOrganizationFormNameProps) => {
  const { organizationForm, onClose } = props;
  const { auth }: any = useSelector((state: any) => state);
  // validation
  const validationSchema = yup.object().shape({
    name: yup.string().required('Campo requerido.')
  });

  const formik = useFormik({
    initialValues: organizationForm,
    onSubmit: (data: OrganizationForm) => {
      //
      if (organizationForm.name === data.name && organizationForm.description === data.description) {
        showMessage('', 'Formulario actualizado.', 'success');
        onClose();
        return;
      }

      data.owner_model_type = 'Organizations';
      data.owner_model_id = auth?.organizationTheme?.organizationId;

      updateForm(data.id ?? '', data)
        .then(() => {
          showMessage('', 'Formulario actualizado.', 'success');
          onClose(true);
        })
        .catch((err: any) => {
          const errorMessage = 'Problemas al actualizar el formulario.';
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
    const result: boolean = await showYesNoQuestion(
      '¿Está seguro de guardar el formulario?',
      'Perderá los cambios realizados.'
    );
    if (result) {
      formik.handleSubmit();
    }
  }, [formik]);

  const handleOnChangeTextField = useCallback(
    (event: any) => {
      const { name, value } = event.target;
      formik.setFieldValue(name, value);
      // formik.setFieldValue('name', inputRemoveAllASCII(value)?.toLowerCase());
    },
    [formik]
  );

  const handleOnClose = useCallback(() => {
    if (!formik.isSubmitting) {
      onClose();
    }
  }, [formik, onClose]);

  return (
    <>
      <Dialog
        open
        title="Nombre de formulario"
        subtitle=""
        onClose={handleOnClose}
        actions={
          <>
            <Button onClick={() => onClose()} variant="outlined" disabled={formik.isSubmitting} text="Cancelar" />

            <Button
              onClick={() => onSubmit()}
              color="primary"
              variant="contained"
              disabled={formik.isSubmitting}
              isLoading={formik.isSubmitting}
              text="Guardar cambios"
            />
          </>
        }
      >
        <TextField
          id="name"
          name="name"
          type="text"
          label="Nombre"
          value={formik.values.name}
          onChange={handleOnChangeTextField}
          disabled={formik.isSubmitting}
          errors={formik.errors}
          touched={formik.touched}
          autoComplete="off"
          inputProps={{
            maxLength: 250
          }}
        />
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
      </Dialog>
    </>
  );
};

export default EditOrganizationFormName;
