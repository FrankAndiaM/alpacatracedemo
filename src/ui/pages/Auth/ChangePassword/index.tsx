import React, { useCallback } from 'react';
import { CircularProgress, Grid, Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useFormik } from 'formik';
import CognitoAWS from '~services/cognito';
import { CognitoChangePassword } from '~models/cognito';
import TextField from '~ui/atoms/TextField/TextField';
import * as yup from 'yup';
import { showMessage } from '~utils/Messages';

const useStyles: any = makeStyles(() => ({
  buttonProgress: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}));

const cognito = new CognitoAWS();

type ChangePasswordProps = unknown;

const ChangePassword: React.FunctionComponent<ChangePasswordProps> = () => {
  const validationSchema = yup.object().shape({
    oldPassword: yup.string().required('El campo es requerido.'),
    newPassword: yup.string().required('El campo es requerido.'),
    verifyNewPassword: yup
      .string()
      .oneOf([yup.ref('newPassword'), null], 'La contraseña no coincide.')
      .required('La confirmacion de contraseña es requerida.')
  });

  const classes = useStyles();

  const initialValues: CognitoChangePassword = {
    oldPassword: '',
    newPassword: '',
    verifyNewPassword: ''
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (credentials: CognitoChangePassword) => {
      _CognitoChangePassword(credentials);
    },
    validationSchema
  });

  const _CognitoChangePassword = useCallback(
    (credentials: CognitoChangePassword) => {
      cognito
        .changePassword(credentials)
        .then(() => {
          showMessage('', 'Se cambio la contraseña con éxito.', 'success');
          formik.setSubmitting(false);
          formik.resetForm();
        })
        .catch(() => {
          formik.setSubmitting(false);
          showMessage('', 'Problemas al cambiar la contraseña del usuario', 'error', true);
        });
    },
    [formik]
  );

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Typography align="center" variant="h5" component="h2">
          Cambiar contraseña
        </Typography>
      </Grid>
      <Box width="100%">
        <TextField
          fullWidth
          id="oldPassword"
          name="oldPassword"
          type="password"
          label="Antigua contraseña"
          value={formik.values.oldPassword}
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
          errors={formik.errors}
          touched={formik.touched}
        />
      </Box>
      <Box width="100%">
        <TextField
          fullWidth
          id="newPassword"
          name="newPassword"
          type="password"
          label="Nueva contraseña"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
          errors={formik.errors}
          touched={formik.touched}
        />
      </Box>
      <Box width="100%">
        <TextField
          fullWidth
          id="verifyNewPassword"
          name="verifyNewPassword"
          type="password"
          label="Confirmar nueva contraseña"
          value={formik.values.verifyNewPassword}
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
          errors={formik.errors}
          touched={formik.touched}
        />
      </Box>
      <Box mt={0.3} width="100%">
        <div className="account__btns">
          <button type="button" className="btn account__btn" onClick={formik.submitForm}>
            Cambiar contraseña
          </button>
          {formik.isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
      </Box>
    </Grid>
  );
};

export default ChangePassword;
