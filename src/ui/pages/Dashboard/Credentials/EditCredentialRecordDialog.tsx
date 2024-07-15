import React, { useCallback } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Grid, Box, FormHelperText } from '@mui/material';
import CustomButton from '~ui/atoms/Button/Button';
import TextField from '~ui/atoms/TextField/TextField';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { showMessage } from '~utils/Messages';

type EditCredentialRecordDialogProps = {
  credentialRecord: any;
  open: boolean;
  onClose(isRefresh: boolean): void;
  onSave(id: any, values: any): Promise<any>;
};

const EditCredentialRecordDialog: React.FC<EditCredentialRecordDialogProps> = (
  props: EditCredentialRecordDialogProps
) => {
  const { credentialRecord, open, onClose, onSave } = props;

  const validationSchema = yup.object().shape({
    last_name: yup.string().required('Campo requerido.'),
    first_name: yup.string().required('Campo requerido.'),
    dni: yup
      .string()
      .required('Campo requerido.')
      .min(8, 'El DNI debe tener 8 caracteres.')
      .max(8, 'El DNI debe tener 8 caracteres.')
  });

  const formik = useFormik({
    initialValues: credentialRecord,
    onSubmit: (values: any) => {
      onSave(values.id, values)
        .then(() => {
          showMessage('', 'Certificado actualizado.', 'success', false);
          onClose(true);
        })
        .catch((err: any) => {
          formik.setSubmitting(false);
          const data = err?.response?.data;
          if (data?.error?.message !== undefined) {
            showMessage('', data?.error?.message, 'error', true);
            return;
          }
          if (data?.message !== undefined) {
            showMessage('', data?.message, 'error', true);
            return;
          }
          showMessage('', 'Problemas al actualizar el certificado.', 'error', true);
        });
    },
    validationSchema
  });

  const handleOnChange = useCallback(
    async (e: any) => {
      let id = e.target.id;
      const value = e.target.value;
      id = id.slice(22, id.length);
      const currentValues = Object.assign({}, formik?.values);
      currentValues['credential_attributes'][id] = value;
      formik.setFieldValue('credential_attributes', currentValues.credential_attributes);
    },
    [formik]
  );

  return (
    <Dialog
      open={open}
      title="Modificar certificado"
      onClose={() => 0}
      actions={
        <>
          <CustomButton
            onClick={() => onClose(false)}
            variant="outlined"
            disabled={formik.isSubmitting}
            text="Cancelar"
          />
          <CustomButton
            variant="contained"
            color="primary"
            text="Guardar"
            disabled={formik.isSubmitting}
            onClick={() => formik.handleSubmit()}
          />
        </>
      }
    >
      <Grid container={true}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box fontWeight="bold" fontSize="16px" textAlign="center">
            {credentialRecord?.credential_name}
          </Box>
          <Box fontWeight="bold" fontSize="14px" py="5px">
            Datos del productor
          </Box>
          <FormHelperText
            error={credentialRecord?.type_error_status === 'farmer_not_found'}
            style={{ marginTop: '0px' }}
          >
            No se encontró al productor registrado
          </FormHelperText>
          <Box>
            <TextField
              fullWidth
              id="first_name"
              name="first_name"
              type="text"
              label="Nombres"
              value={formik?.values?.first_name}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              errors={formik.errors}
              touched={formik.touched}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              id="last_name"
              name="last_name"
              type="text"
              label="Apellidos"
              value={formik?.values?.last_name}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              errors={formik.errors}
              touched={formik.touched}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              id="dni"
              name="dni"
              type="text"
              label="DNI"
              value={formik?.values?.dni}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              errors={formik.errors}
              touched={formik.touched}
            />
          </Box>
          <Box fontWeight="bold" fontSize="14px" py="5px">
            Datos del certificado
          </Box>
          {Object.keys(formik?.values?.credential_attributes).map((key: any, index: number) => (
            <Box key={`attrib_${index}`}>
              <TextField
                fullWidth
                id={`credential_attributes.${key}`}
                name={`credential_attributes.${key}`}
                type="text"
                label={key}
                value={credentialRecord?.credential_attributes?.[key]}
                onChange={(e: any) => handleOnChange(e)}
                disabled={formik.isSubmitting}
              />
              <FormHelperText
                error={formik?.values?.credentials_attributes_errors[key] !== ''}
                style={{ marginTop: '0px' }}
              >
                {formik?.values?.credentials_attributes_errors[key]}
              </FormHelperText>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default EditCredentialRecordDialog;
