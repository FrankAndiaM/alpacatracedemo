import React, { useCallback, useState } from 'react';
import { Grid, Icon, Box, CircularProgress } from '@mui/material';
import { InputAdornment, IconButton } from '@mui/material';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '~ui/atoms/TextField/TextField';
import Button from '~ui/atoms/Button/Button';
import { AgroLeader } from '~models/agroLeader';
import { AxiosResponse } from 'axios';
import { showMessage } from '~utils/Messages';
import PhoneTextField from '~ui/atoms/PhoneTextField/PhoneTextField';
import { inputRemoveAllASCII } from '~utils/inputs';
import { getDNIData } from '~services/reniec';
// import SelectField from '~ui/atoms/SelectField/SelectField';
// import DateField from '~ui/atoms/DateField/DateField';
import moment from 'moment';

type AgroLeaderDialogProps = {
  agroLeader?: AgroLeader;
  closeAction(isUpdateTable?: boolean): void;
  saveAction(agroLeader: AgroLeader): Promise<AxiosResponse<any>>;
};

const AgroLeaderDialog: React.FC<AgroLeaderDialogProps> = (props: AgroLeaderDialogProps) => {
  const { closeAction, saveAction, agroLeader } = props;
  const [isLoadingDNI, setIsLoadingDNI] = useState<boolean>(false);
  const [isEdit] = useState<boolean>(agroLeader?.id ? true : false);

  const newAgroLeader: any = {
    id: agroLeader?.id ?? '',
    username: agroLeader?.username ?? '',
    first_name: agroLeader?.first_name ?? '',
    last_name: agroLeader?.last_name ?? '',
    dni: agroLeader?.dni ?? '',
    email: agroLeader?.email ?? '',
    phone: agroLeader?.phone ?? ''
  };

  // validation
  const validationSchema = yup.object().shape({
    last_name: yup.string().required('Campo requerido.'),
    first_name: yup.string().required('Campo requerido.'),
    username: yup.string().required('Campo requerido.'),
    phone: yup.string().required('Campo requerido.'),
    dni: yup.string().required('Campo requerido.')
  });

  const formik = useFormik({
    initialValues: newAgroLeader,
    onSubmit: (value: AgroLeader) => {
      //Verifica Phone
      if (
        (formik.values.phone === '' && formik.values.whatsapp_number === '') ||
        (formik.values.phone === '51' && formik.values.whatsapp_number === '51')
      ) {
        formik.setSubmitting(false);
        formik.setErrors({
          phone: 'Debe registrar celular ó Whatsapp.',
          whatsapp_number: 'Debe registrar celular ó Whatsapp.'
        });
        return;
      }
      const errors: any = {};
      if (
        formik?.values?.phone?.slice(0, 2) === '51' &&
        formik?.values?.phone?.length > 2 &&
        formik?.values?.phone?.length !== 11
      ) {
        errors['phone'] = 'El número de celular debe tener 9 caracteres.';
      }

      if (
        formik?.values?.whatsapp_number?.slice(0, 2) === '51' &&
        formik?.values?.whatsapp_number?.length > 2 &&
        formik?.values?.whatsapp_number?.length !== 11
      ) {
        formik.setSubmitting(false);
        errors['whatsapp_number'] = 'El número de whatsapp debe tener 9 caracteres.';
      }
      if (Object.keys(errors).length !== 0) {
        formik.setSubmitting(false);
        formik.setErrors(errors);
        return;
      }

      const prevAgroLeader = Object.assign({}, value);
      const phone = prevAgroLeader.phone ? prevAgroLeader.phone : '';
      if (!phone.includes('+')) {
        prevAgroLeader['phone'] = phone.length > 5 ? '+' + phone : '';
      }
      const whatsapp_number = prevAgroLeader.whatsapp_number ? prevAgroLeader.whatsapp_number : '';
      if (!whatsapp_number.includes('+')) {
        prevAgroLeader['whatsapp_number'] = whatsapp_number.length > 5 ? '+' + whatsapp_number : '';
      }
      if (value.birthday_at != null) {
        prevAgroLeader['birthday_at'] = moment(value.birthday_at)?.format('YYYY-MM-DD');
      }
      saveAction(prevAgroLeader)
        .then((res: any) => {
          const { message } = res?.data?.data;
          showMessage('', message ?? '', 'success', false);
          closeAction(true);
        })
        .catch((err: any) => {
          const errorMessage = 'Problemas al crear al usuario.';
          const data = err?.response?.data;
          if (data?.hasOwnProperty('error')) {
            showMessage('', data?.error?.message ?? errorMessage, data?.error?.type ?? 'error', true);
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

  // const handleOnChangeSelect = useCallback(
  //   (field: string, value: any) => {
  //     formik.setFieldValue(field, value);
  //   },
  //   [formik]
  // );

  const handleOnChangePhoneInput = useCallback(
    (value: string, name: string) => {
      formik.setFieldValue(name, value);
    },
    [formik]
  );

  const handleOnChangeUsernameInput = useCallback(
    (event: any) => {
      const { name, value } = event.target;
      formik.setFieldValue(name, inputRemoveAllASCII(value)?.toLowerCase());
    },
    [formik]
  );

  const handleOnGetDNIData = useCallback(() => {
    if (formik?.values?.dni?.length !== 8) {
      showMessage('', 'El DNI debe tener 8 digitos.', 'warning', true);
      return;
    }
    setIsLoadingDNI(true);
    getDNIData(formik?.values?.dni)
      .then((res: any) => {
        const data = res?.data?.data;
        const name = data?.name ?? '';
        const first_name = data?.first_name ?? '';
        const last_name = data?.last_name ?? '';
        formik.setFieldValue('first_name', name);
        formik.setFieldValue('last_name', `${first_name} ${last_name}`);
        setIsLoadingDNI(false);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar la información.', 'error', true);
        setIsLoadingDNI(false);
      });
    setIsLoadingDNI(true);
  }, [formik]);

  // const handleOnChangeSelectPhoneInput = useCallback(
  //   (value: string, name: string) => {
  //     formik.setFieldValue(value, name);
  //   },
  //   [formik]
  // );

  // const handleOnChangeDate = (value: any, _keyboardInputValue?: string | undefined) => {
  //   formik.setFieldValue('birthday_at', value);
  // };

  return (
    <Dialog
      open={true}
      title="Nuevo usuario"
      subtitle="Información del usuario"
      onClose={() => closeAction()}
      actions={
        <Box
          display="flex"
          flexDirection={{ xs: 'column-reverse', md: 'row' }}
          justifyContent={'space-between'}
          width={'100%'}
        >
          <Button
            onClick={() => closeAction()}
            variant="outlined"
            fullWidth
            disabled={formik.isSubmitting}
            text="Cancelar"
          />

          <Button
            onClick={() => onSubmit()}
            color="primary"
            variant="contained"
            fullWidth
            disabled={formik.isSubmitting}
            isLoading={formik.isSubmitting}
            text={isEdit ? 'Guardar' : 'Crear nuevo usuario'}
          />
        </Box>
      }
    >
      <Grid container spacing={1}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            id="dni"
            name="dni"
            type="text"
            label="DNI"
            value={formik.values.dni}
            disabled={formik.isSubmitting || isEdit}
            errors={formik.errors}
            variant="outlined"
            touched={formik.touched}
            onChange={(e: any) => {
              formik.setFieldValue('first_name', '');
              formik.setFieldValue('last_name', '');
              formik.handleChange(e);
            }}
            onKeyPress={(e: any) => {
              const value = e?.target?.value;
              if (e.key === 'Enter' && value?.length === 8) {
                handleOnGetDNIData();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box position="relative">
                    {isLoadingDNI && (
                      <CircularProgress
                        color="primary"
                        sx={{
                          position: 'absolute',
                          marginTop: '5px',
                          marginLeft: '5px',
                          width: '30px !important',
                          height: '30px !important'
                        }}
                      />
                    )}
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleOnGetDNIData}
                      disabled={isLoadingDNI || formik.isSubmitting}
                    >
                      <Icon>search</Icon>
                    </IconButton>
                  </Box>
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item={true} xs={12} sm={12} md={6} lg={6} xl={6}>
          <TextField
            id="first_name"
            name="first_name"
            type="text"
            label="Nombre"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting || isEdit}
            errors={formik.errors}
            touched={formik.touched}
            variant="outlined"
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={6} lg={6} xl={6}>
          <TextField
            id="last_name"
            name="last_name"
            type="text"
            label="Apellidos"
            value={formik.values.last_name}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting || isEdit}
            errors={formik.errors}
            touched={formik.touched}
            variant="outlined"
          />
        </Grid>
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
            variant="outlined"
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
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
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            id="username"
            name="username"
            type="text"
            label="Nombre de usuario"
            value={formik.values.username}
            onChange={handleOnChangeUsernameInput}
            disabled={formik.isSubmitting || isEdit}
            errors={formik.errors}
            touched={formik.touched}
            variant="outlined"
            inputProps={{
              maxLength: 20
            }}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default React.memo(AgroLeaderDialog);
