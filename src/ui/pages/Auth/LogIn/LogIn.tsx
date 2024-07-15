import React, { useState, useCallback } from 'react';
import {
  Box,
  CircularProgress,
  Divider,
  Typography,
  InputAdornment,
  IconButton,
  useMediaQuery
  // Button
} from '@mui/material';
import TextFieldMaterial from '@mui/material/TextField';
import TextField from '~ui/atoms/TextField/TextField';
import { makeStyles } from '@mui/styles';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { signIn } from '~redux-store/actions/authActions';
import CognitoAWS from '~services/cognito';
import { CognitoCredentials } from '~models/cognito';
import * as yup from 'yup';
import './Login.scss';
import { useSnackbar } from 'notistack';
// import IconUser from '~assets/icons/user.svg';
import IconPassword from '~assets/icons/password.svg';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import useStylesTextField from './TextField.css';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import routesName from '~routes/routes';
import Button from '~ui/atoms/Button/Button';

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

type LogInProps = {
  onVerifyCode(userName?: string): void;
};

const cognito = new CognitoAWS();

const LogIn: React.FC<LogInProps> = (props: LogInProps) => {
  const matches = useMediaQuery('(min-width:640px)');
  const history = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [isNewPassword, setIsNewPassword] = useState<boolean>(false);
  const [isViewPassword, setIsViewPassword] = useState<boolean>(false);
  const [isViewNewPassword, setIsViewNewPassword] = useState<boolean>(false);
  const [isViewVerifyPassword, setIsViewVerifyPassword] = useState<boolean>(false);

  const { onVerifyCode } = props;
  const validationSchema = yup.object().shape({
    username: yup.string().required('Ingrese el usuario.'),
    password: yup.string().required('Ingrese la contraseña.'),
    newPassword: yup.string().when('showNewPassword', {
      is: () => isNewPassword,
      then: yup.string().required('Ingrese la nueva contraseña.').typeError('Ingrese la nueva contraseña.')
    }),
    verifyNewPassword: yup.string().when('newPassword', {
      is: () => isNewPassword,
      then: yup
        .string()
        .oneOf([yup.ref('newPassword'), null], 'La contraseña no coincide.')
        .required('La confirmación de contraseña es requerida.')
    })
  });

  const dispatch = useDispatch();
  const classes = useStyles();
  const classesTextField = useStylesTextField();

  const initialValues: CognitoCredentials = {
    username: '',
    password: '',
    newPassword: '',
    verifyNewPassword: ''
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (credentials: CognitoCredentials) => {
      _simpleLogin(credentials);
    },
    validationSchema
  });

  const alertMessage = useCallback(
    (message: string = 'Error', type: any = 'warning', duration: number = 3000) => {
      return enqueueSnackbar(message, {
        autoHideDuration: duration,
        variant: type,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });
    },
    [enqueueSnackbar]
  );

  const _simpleLogin = useCallback(
    (credentials: CognitoCredentials) => {
      cognito
        .logIn(credentials)
        .then((res: any) => {
          const {
            accessToken,
            idToken: {
              jwtToken,
              payload: { name, family_name }
            },
            refreshToken: { token }
          } = res;

          if (
            accessToken.payload &&
            accessToken.payload['cognito:groups'] &&
            Array.isArray(accessToken.payload['cognito:groups']) &&
            accessToken.payload['cognito:groups'].includes('agro_associations')
          ) {
            formik.setSubmitting(false);
            formik.setTouched({});
            alertMessage('No se encuentra autorizado para acceder.');
            return;
          }

          const association_id = res.idToken.payload['custom:association_id'] || null;
          const values: any = {
            authReady: true,
            isLoggedIn: true,
            user: {
              accessToken: accessToken.jwtToken,
              idToken: jwtToken,
              payload: { username: accessToken.payload.username, name, family_name, association_id: association_id },
              refreshToken: token
            }
          };
          localStorage.setItem('token', jwtToken);
          dispatch(signIn(values));
          history(routesName.dashboard);
        })
        .catch((error: any) => {
          const { message } = error;
          formik.setSubmitting(false);
          formik.setTouched({});
          switch (error.code) {
            case 'UserNotConfirmedException':
              onVerifyCode(formik.values.username);
              break;
            case 'UserLambdaValidationException':
              let newMessage = '';

              if (message.includes('PreSignUp')) {
                newMessage = message.split('PreSignUp failed with error ');
              }
              if (message.includes('PostConfirmation')) {
                newMessage = message.split('PostConfirmation failed with error ');
              }
              if (message.includes('PreAuthentication')) {
                newMessage = message.split('PreAuthentication failed with error ');
              }
              if (newMessage.length === 2) {
                alertMessage(newMessage[1], 'warning');
                break;
              }
              alertMessage('Error al intentar ingresar', 'warning');
              break;
            case 'NewPasswordRequired':
              setIsNewPassword(true);
              break;
            case 'NotAuthorizedException':
              if (message.includes('Incorrect username')) {
                alertMessage('Usuario o password incorrecto');
                break;
              }
              if (message.includes('User is disabled')) {
                alertMessage('Usuario se encuentra desactivado');
                break;
              }
              alertMessage('No se encuentra autorizado para acceder.');
              break;
            case 'InvalidPasswordException':
              alertMessage('La contraseña ingresada no cumple con las políticas especificadas.');
              break;
            default:
              // setErrorMessage('Contraseña incorrecta');
              alertMessage('Error al intentar ingresar');
              break;
          }
        });
    },
    [alertMessage, dispatch, formik, onVerifyCode, history]
  );

  const handlerRecoveryPassword = (event: any) => {
    event.preventDefault();
    const username = formik.values.username.trim();
    if (username) {
      cognito
        .forgotPassword(username)
        .then(() => {
          alertMessage('Se ha enviado el código de verificación al celular registrado.', 'success');
          onVerifyCode(formik.values.username);
        })
        .catch((error: any) => {
          switch (error.code) {
            case 'LimitExceededException':
              alertMessage('A superado el limite de intentos. Inténtelo mas tarde!');
              break;
            case 'NotAuthorizedException':
              alertMessage('Usuario no se encuentra autorizado!');
              break;
            case 'UserNotConfirmedException':
              alertMessage('Usuario no se encuentra activo');
              break;
            case 'UserNotFoundException':
              alertMessage('Usuario no existe');
              break;
            default:
              alertMessage('Existe un problema al intentar recuperar la clave. Inténtelo mas tarde!');
              break;
          }
        });
    } else {
      alertMessage('Es necesario que introduzca su usuario');
    }
  };

  const handleOnClickShowTerms = useCallback(() => {
    history('/terminos_y_condiciones');
  }, [history]);

  return (
    <>
      {/*Aquí es el formulario */}
      {isNewPassword && (
        <Box color="gray">
          <Typography align="center" variant="h5" component="h2" style={{ marginBottom: '10px' }} fontWeight="bold">
            Cambio de contraseña
          </Typography>
          <Typography variant="subtitle2" align="justify" style={{ fontWeight: 'bold', marginBottom: '15px' }}>
            Por ser el primer inicio de sesión, cambie su contraseña y asegúrese que incluya:
          </Typography>
          <Typography variant="subtitle2" gutterBottom style={{ fontWeight: 'bold' }}>
            &bull; 8 caracteres como mínimo.
            <br />
            &bull; Números, mayúsculas, minúsculas y caracteres especiales (+&/$...).
            <br />
          </Typography>
          <Divider style={{ marginTop: '5px', marginBottom: '5px' }} />
        </Box>
      )}
      <form className="form">
        {!isNewPassword ? (
          <>
            <div className="form__form-group">
              {/* <p className="form__form-group-label">Usuario</p> */}
              <TextField
                // className={clsx(
                //   classesTextField.root,
                //   !(formik.errors['username'] && formik.touched['username'] && Boolean(formik.errors['username']))
                //     ? classesTextField.default
                //     : null
                // )}
                id="username"
                fullWidth
                name="username"
                focused
                autoComplete="username"
                label="Usuario"
                variant="outlined"
                value={formik.values.username}
                onChange={formik.handleChange}
                disabled={formik.isSubmitting}
                onBlur={formik.handleBlur}
                placeholder="Usuario"
                errors={formik.errors}
                // helperText={formik.errors['username'] && formik.touched['username'] ? formik.errors['username'] : ''}
                // InputProps={{
                //   startAdornment: (
                //     <InputAdornment position="start">
                //       <img src={IconUser} alt="user" />
                //     </InputAdornment>
                //   )
                // }}
              />
            </div>

            <div className="form__form-group">
              {/* <p className="form__form-group-label">Contraseña</p> */}
              <TextField
                // className={clsx(
                //   classesTextField.root,
                //   !(formik.errors['password'] && formik.touched['password'] && Boolean(formik.errors['password']))
                //     ? classesTextField.default
                //     : null
                // )}
                fullWidth
                id="password"
                name="password"
                focused
                label="Contraseña"
                variant="outlined"
                type={isViewPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                disabled={formik.isSubmitting}
                onBlur={formik.handleBlur}
                placeholder="Ingrese contraseña"
                // helperText={formik.errors['password'] && formik.touched['password'] ? formik.errors['password'] : ''}
                errors={formik.errors}
                InputProps={{
                  // startAdornment: (
                  //   <InputAdornment position="start">
                  //     <img src={IconPassword} alt="password" />
                  //   </InputAdornment>
                  // ),
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        disabled={formik.isSubmitting}
                        style={{ padding: '3px' }}
                        onClick={() => setIsViewPassword((prevValue: boolean) => !prevValue)}
                      >
                        {isViewPassword ? <RemoveRedEyeOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="form__form-group">
              <p className="form__form-group-label">Nueva Contraseña</p>
              <TextFieldMaterial
                className={clsx(
                  classesTextField.root,
                  !(
                    formik.errors['newPassword'] &&
                    formik.touched['newPassword'] &&
                    Boolean(formik.errors['newPassword'])
                  )
                    ? classesTextField.default
                    : null
                )}
                id="newPassword"
                fullWidth
                name="newPassword"
                label=""
                variant="outlined"
                color="primary"
                type={isViewNewPassword ? 'text' : 'password'}
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                disabled={formik.isSubmitting}
                onBlur={formik.handleBlur}
                placeholder="Contraseña"
                autoComplete="new-password"
                error={
                  formik.errors['newPassword'] && formik.touched['newPassword'] && Boolean(formik.errors['newPassword'])
                    ? true
                    : false
                }
                helperText={
                  formik.errors['newPassword'] && formik.touched['newPassword'] ? formik.errors['newPassword'] : ''
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={IconPassword} alt="password" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        disabled={formik.isSubmitting}
                        style={{ padding: '3px' }}
                        onClick={() => setIsViewNewPassword((prevValue: boolean) => !prevValue)}
                      >
                        {isViewNewPassword ? <RemoveRedEyeOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </div>

            <div className="form__form-group">
              <p className="form__form-group-label">Confirme Contraseña</p>
              <TextFieldMaterial
                className={clsx(
                  classesTextField.root,
                  !(
                    formik.errors['verifyNewPassword'] &&
                    formik.touched['verifyNewPassword'] &&
                    Boolean(formik.errors['verifyNewPassword'])
                  )
                    ? classesTextField.default
                    : null
                )}
                id="verifyNewPassword"
                fullWidth
                name="verifyNewPassword"
                label=""
                variant="outlined"
                color="primary"
                type={isViewVerifyPassword ? 'text' : 'password'}
                value={formik.values.verifyNewPassword}
                onChange={formik.handleChange}
                disabled={formik.isSubmitting}
                onBlur={formik.handleBlur}
                placeholder="Contraseña"
                autoComplete="new-password"
                error={
                  formik.errors['verifyNewPassword'] &&
                  formik.touched['verifyNewPassword'] &&
                  Boolean(formik.errors['verifyNewPassword'])
                    ? true
                    : false
                }
                helperText={
                  formik.errors['verifyNewPassword'] && formik.touched['verifyNewPassword']
                    ? formik.errors['verifyNewPassword']
                    : ''
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={IconPassword} alt="password" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        disabled={formik.isSubmitting}
                        style={{ padding: '3px' }}
                        onClick={() => setIsViewVerifyPassword((prevValue: boolean) => !prevValue)}
                      >
                        {isViewVerifyPassword ? <RemoveRedEyeOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </div>
          </>
        )}
        <Box display="flex" justifyContent="flex-end" my={2}>
          <Box color="#2F3336" fontSize="14px" fontWeight={600}>
            ¿No recuerda su clave?&nbsp;
            <strong style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={handlerRecoveryPassword}>
              Restaure Aquí!
            </strong>
          </Box>
        </Box>
        <Box sx={matches ? { p: 2, lineHeight: '1.2rem' } : { p: 2 }}>
          Al continuar, aceptas los{' '}
          <Box component="span" sx={{ cursor: 'pointer' }} onClick={handleOnClickShowTerms}>
            términos y condiciones{' '}
          </Box>
          de{' '}
          <Box component="span" fontWeight={700}>
            ALPACA TRACE{' '}
          </Box>
          y que leíste nuestra{' '}
          <Box component="span" sx={{ cursor: 'pointer' }} onClick={handleOnClickShowTerms}>
            política de privacidad.
          </Box>
        </Box>
      </form>
      <Box
        width="100%"
        style={
          matches
            ? {
                padding: '0rem 6rem'
              }
            : {}
        }
      >
        <div style={{ position: 'relative' }}>
          <Button text="Ingresar" fullWidth color="primary" variant="contained" onClick={formik.submitForm} />
          {/* <Button color="primary" variant="contained" onClick={formik.submitForm}>
            Ingresar
          </Button> */}

          {formik.isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
        {/* <a>¿No recuerda su clave?. <strong style={{cursor:'pointer'}}
      onClick={HandlerRecoveryPassword}>Restaure Aquí!</strong></a> */}
      </Box>
    </>
  );
};

export default React.memo(LogIn);
