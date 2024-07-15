import React, { useState, useCallback } from 'react';
import { CircularProgress, Box, Typography, Link } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useFormik } from 'formik';
import CognitoAWS from '~services/cognito';
import { CognitoCredentials } from '~models/cognito';
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

type ConfirmedCodeProps = {
  onVerifyCode(): void;
};

const cognito = new CognitoAWS();

const ConfirmedCode: React.FC<ConfirmedCodeProps> = (props: ConfirmedCodeProps) => {
  const { onVerifyCode } = props;

  const validationSchema = yup.object().shape({
    username: yup.string().required('Ingrese el usuario.'),
    verifyCode: yup.string().required('Ingrese el código.')
  });

  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const initialValues: CognitoCredentials = { username: '', verifyCode: '' };

  const formik = useFormik({
    initialValues,
    onSubmit: (credentials: CognitoCredentials) => {
      _verifyCode(credentials);
    },
    validationSchema
  });

  const _verifyCode = useCallback(
    (credentials: CognitoCredentials) => {
      cognito
        .confirmedRegistration(credentials)
        .then(() => {
          showMessage('', 'Verificacion de código exitosa.', 'success');
          onVerifyCode();
        })
        .catch((error: any) => {
          if (error.code === 'ExpiredCodeException') {
            formik.setSubmitting(false);
            setErrorMessage('Código de verificación expiró.');
          } else {
            formik.setSubmitting(false);
            setErrorMessage('Código incorrecto.');
          }
        });
    },
    [formik, onVerifyCode]
  );

  const handleResendCode = useCallback(async () => {
    const validateForm = await formik.validateForm();
    // eslint-disable-next-line no-prototype-builtins
    if (validateForm.hasOwnProperty('username')) {
      showMessage('', 'Ingrese el nombre de usuario.', 'error', true);
    } else {
      cognito
        .resendConfirmationCode(formik.values)
        .then(() => {
          showMessage('', 'Código enviado.', 'success');
        })
        .catch(() => {
          formik.setSubmitting(false);
          showMessage('', 'Problemas al reenviar el codigo de verificación.', 'error', true);
        });
    }
  }, [formik]);

  return (
    <>
      <Typography align="center" variant="h5" component="h2" style={{ color: '#339253', marginBottom: '10px' }}>
        Verificar Código
      </Typography>

      <form className="form" autoComplete="off">
        <div className="form__form-group">
          <span className="form__form-group-label">Usuario</span>
          <input
            id="username"
            name="username"
            type="text"
            value={formik.values.username}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            placeholder="Ingrese su usuario"
          />
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Codigo de verificacion</span>
          <input
            id="verifyCode"
            name="verifyCode"
            type="text"
            value={formik.values.verifyCode}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            placeholder="Codigo de verificacion"
          />
          <div className="form__form-group-error">
            <span>{errorMessage}</span>
          </div>
        </div>
      </form>

      <Link component="button" onClick={handleResendCode}>
        Reenviar codigo de verificación
      </Link>
      <Box mt={1} width="100%">
        <div className="account__btns">
          <button type="button" className="btn account__btn" onClick={formik.submitForm}>
            Verificar Código
          </button>
          {formik.isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
      </Box>
    </>
  );
};

export default React.memo(ConfirmedCode);
