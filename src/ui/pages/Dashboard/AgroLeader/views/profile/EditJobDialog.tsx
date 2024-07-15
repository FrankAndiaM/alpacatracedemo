import React, { useCallback } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Grid } from '@mui/material';
import { useFormik } from 'formik';
import Button from '~ui/atoms/Button/Button';
import { AgroLeader } from '~models/agroLeader';
import TextField from '~ui/atoms/TextField/TextField';
import { updateAgroLeader } from '~services/agro_leaders';
import { showMessage } from '~utils/Messages';
import { SET_AGRO_LEADER } from '../../store/agroLeaderConstants';
import { useAgroLeaderDispatch, useAgroLeaderStore } from '../../store/agroLeaderContext';

type EditJobDialogProps = {
  closeAction(): void;
};

const EditJobDialog: React.FC<EditJobDialogProps> = (props: EditJobDialogProps) => {
  const agroLeaderDispatch = useAgroLeaderDispatch();
  const { closeAction } = props;
  const { agroLeader } = useAgroLeaderStore();

  const formik = useFormik({
    initialValues: agroLeader,
    onSubmit: (value: AgroLeader) => {
      //Verifica Phone
      updateAgroLeader(value.id, value)
        .then((res: any) => {
          const message = res?.data?.message;
          showMessage('', message, 'success');
          agroLeaderDispatch({ type: SET_AGRO_LEADER, payload: value });
          closeAction();
        })
        .catch((err: any) => {
          const errorMessage = 'Problemas al actualizar al productor.';
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
    }
  });

  const onSubmit = useCallback(async () => {
    await formik.setErrors({});
    formik.handleSubmit();
  }, [formik]);

  return (
    <>
      <Dialog
        open={true}
        title="Actualizar agente"
        subtitle=""
        onClose={() => closeAction()}
        actions={
          <>
            <Button onClick={() => closeAction()} variant="outlined" disabled={formik.isSubmitting} text="Cancelar" />

            <Button
              onClick={() => onSubmit()}
              color="primary"
              variant="contained"
              disabled={formik.isSubmitting}
              isLoading={formik.isSubmitting}
              text={agroLeader !== undefined ? 'Guardar' : 'Registrar'}
            />
          </>
        }
      >
        <Grid container spacing={1}>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="job_title"
              name="job_title"
              type="text"
              label="Puesto que ocupa"
              value={formik.values.job_title}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              errors={formik.errors}
              touched={formik.touched}
            />
          </Grid>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              id="work_place"
              name="work_place"
              type="text"
              label="Lugar de trabajo"
              value={formik.values.work_place}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              errors={formik.errors}
              touched={formik.touched}
            />
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

export default EditJobDialog;
