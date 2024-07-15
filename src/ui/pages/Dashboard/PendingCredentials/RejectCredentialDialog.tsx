import React, { useCallback } from 'react';
import TextField from '~ui/atoms/TextField/TextField';
import { Grid } from '@mui/material';
import Button from '~ui/atoms/Button/Button';
import { useFormik } from 'formik';
import Dialog from '~ui/molecules/Dialog/Dialog';
import * as yup from 'yup';
import { AxiosResponse } from 'axios';
import { showMessage } from '~utils/Messages';

type RejectCredentialDialogProps = {
  credential_id?: string;
  onClose(isUpdated?: boolean): void;
  onSave(credentialId: any, data: any): Promise<AxiosResponse<any>>;
};

const RejectCredentialDialog: React.FC<RejectCredentialDialogProps> = (props: RejectCredentialDialogProps) => {
  const { credential_id, onClose, onSave } = props;

  const initialValues = { reason: '' };
  const validationSchema = yup.object().shape({
    reason: yup.string().required('Campo requerido.')
  });

  const formik = useFormik({
    initialValues,
    onSubmit: (credential: any) => {
      onSave(credential_id, credential)
        .then((res: any) => {
          const message = res?.data?.data;
          showMessage('', message, 'success');
          onClose(true);
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
      // .then(() => {
      //   setSelectedStatus('reject');
      //   showMessage('', 'Certificado emitido.', 'success');
      // })
      // .catch((err: any) => {
      //   const data = err?.response?.data;
      //   if (data?.error?.message !== undefined) {
      //     showMessage('', data?.error?.message, 'error', true);
      //     return;
      //   }
      //   if (data?.message !== undefined) {
      //     showMessage('', data?.message, 'error', true);
      //     return;
      //   }
      //   showMessage('', 'Problemas al emitir el certificado.', 'error', true);
      // });
    },
    validationSchema
  });

  const onSubmit = useCallback(async () => {
    await formik.setErrors({});
    formik.handleSubmit();
  }, [formik]);

  return (
    <>
      <Dialog
        open
        title="Observación"
        subtitle="Por favor registra el motivo de la observación"
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
              id="reason"
              name="reason"
              type="text"
              label="Razón"
              value={formik.values.reason}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              errors={formik.errors}
              touched={formik.touched}
              multiline
            />
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

export default RejectCredentialDialog;
