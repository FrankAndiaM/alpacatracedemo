import React, { useCallback } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '~ui/atoms/TextField/TextField';
import Button from '~ui/atoms/Button/Button';
import { AgroLeader } from '~models/agroLeader';
import { updateAgroLeader } from '~services/agro_leaders';
import { showMessage } from '~utils/Messages';
import SelectField from '~ui/atoms/SelectField/SelectField';
import { useAgroLeaderDispatch, useAgroLeaderStore } from '../../store/agroLeaderContext';
import PhoneTextField from '~ui/atoms/PhoneTextField/PhoneTextField';
import { SET_AGRO_LEADER } from '../../store/agroLeaderConstants';

type AgroLeaderCommunicationDialogProps = {
  closeAction(): void;
};

const itemOperador = [
  // { description: 'Selecciona operador', value: '' },
  { description: 'Bitel', value: 'Bitel' },
  { description: 'Entel', value: 'Entel' },
  { description: 'Movistar', value: 'Movistar' },
  { description: 'Claro', value: 'Claro' },
  { description: 'Otro', value: 'Otro' }
];

const operationSystem = [
  // { description: 'Selecciona sistema operativo', value: '' },
  { description: 'Android', value: 'Android' },
  { description: 'iOS', value: 'iOS' }
];

const EditCommunicationDialog: React.FC<AgroLeaderCommunicationDialogProps> = (
  props: AgroLeaderCommunicationDialogProps
) => {
  const agroLeaderDispatch = useAgroLeaderDispatch();
  const { closeAction } = props;
  const { agroLeader } = useAgroLeaderStore();

  // validation
  const validationSchema = yup.object().shape({
    phone: yup.string().required('Campo requerido.')
  });

  const formik = useFormik({
    initialValues: agroLeader,
    onSubmit: (value: AgroLeader) => {
      //Verifica Phone
      if (formik.values.phone === '' || formik.values.phone === '51') {
        formik.setSubmitting(false);
        formik.setErrors({
          phone: 'Campo requerido.'
        });
        return;
      }
      if (
        formik?.values?.phone?.slice(0, 2) === '51' &&
        formik?.values?.phone?.length > 2 &&
        formik?.values?.phone?.length !== 11
      ) {
        formik.setSubmitting(false);
        formik.setErrors({
          phone: 'El número de celular debe tener 9 caracteres.'
        });
        return;
      }

      const prevAgroLeader = Object.assign({}, value);
      const phone = prevAgroLeader.phone ? prevAgroLeader.phone : '';
      if (!phone.includes('+')) {
        prevAgroLeader['phone'] = phone.length > 5 ? '+' + phone : '';
      }

      const whatsapp_number = prevAgroLeader.whatsapp_number ? prevAgroLeader.whatsapp_number : '';
      if (whatsapp_number !== '' && whatsapp_number !== '51') {
        if (whatsapp_number?.slice(0, 2) === '51' && whatsapp_number?.length > 2 && whatsapp_number?.length !== 11) {
          formik.setSubmitting(false);
          formik.setErrors({
            whatsapp_number: 'El número de celular debe tener 9 caracteres.'
          });
          return;
        }
        if (!whatsapp_number.includes('+')) {
          prevAgroLeader['whatsapp_number'] = whatsapp_number?.length > 5 ? '+' + whatsapp_number : '';
        }
      }

      if (formik?.values?.whatsapp_number === '51') {
        prevAgroLeader['whatsapp_number'] = '';
      }

      updateAgroLeader(value.id, prevAgroLeader)
        .then((res: any) => {
          const message = res?.data?.message;
          showMessage('', message, 'success');
          agroLeaderDispatch({ type: SET_AGRO_LEADER, payload: prevAgroLeader });
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
    },
    validationSchema
  });

  const handleOnChangePhoneInput = useCallback(
    (value: string, name: string) => {
      formik.setFieldValue(name, value);
    },
    [formik]
  );

  const handleOnChangeSelectPhoneInput = useCallback(
    (value: string, name: string) => {
      formik.setFieldValue(value, name);
    },
    [formik]
  );

  const onSubmit = useCallback(async () => {
    await formik.setErrors({});
    formik.handleSubmit();
  }, [formik]);

  return (
    <>
      <Dialog
        open={true}
        title="Actualizar agente"
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
              id="email"
              name="email"
              type="text"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              errors={formik.errors}
              touched={formik.touched}
            />
          </Grid>
          <Grid item={true} xs={12} sm={12} md={6} lg={6} xl={6}>
            <PhoneTextField
              id="phone"
              name="phone"
              label="Celular"
              value={formik.values?.phone}
              onChange={handleOnChangePhoneInput}
              errors={formik.errors}
              touched={formik.touched}
              disabled={formik.isSubmitting}
            />
          </Grid>
          <Grid item={true} xs={12} sm={12} md={6} lg={6} xl={6}>
            <PhoneTextField
              id="whatsapp_number"
              name="whatsapp_number"
              label="Whatsapp"
              value={formik.values.whatsapp_number}
              onChange={handleOnChangePhoneInput}
              errors={formik.errors}
              touched={formik.touched}
              disabled={formik.isSubmitting}
            />
          </Grid>

          <Grid item={true} xs={6} sm={6} md={6} lg={6} xl={6}>
            <SelectField
              id="phone_carrier"
              name="phone_carrier"
              label="Operador"
              items={itemOperador}
              itemText="description"
              itemValue="value"
              value={formik.values.phone_carrier}
              onChange={handleOnChangeSelectPhoneInput}
              errors={formik.errors}
              touched={formik.touched}
              disabled={formik.isSubmitting}
            />
          </Grid>

          <Grid item={true} xs={6} sm={6} md={6} lg={6} xl={6}>
            <TextField
              id="phone_brand_model"
              name="phone_brand_model"
              type="text"
              label="Marca y modelo de celular"
              value={formik.values.phone_brand_model}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              errors={formik.errors}
              touched={formik.touched}
            />
          </Grid>
          <Grid item={true} xs={6} sm={6} md={6} lg={6} xl={6}>
            <SelectField
              id="phone_operation_system"
              name="phone_operation_system"
              label="Sistema operativo del celular"
              items={operationSystem}
              itemText="description"
              itemValue="value"
              value={formik.values.phone_operation_system}
              onChange={handleOnChangeSelectPhoneInput}
              errors={formik.errors}
              touched={formik.touched}
              disabled={formik.isSubmitting}
            />
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

export default EditCommunicationDialog;
