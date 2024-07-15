import CognitoAWS from '~services/cognito';
import { showMessage } from '~utils/Messages';
import { THEME, SIGN_IN, SIGN_OUT, LOADING_AUTH, REFRESH_TOkEN, UPDATE_COUNT_SIDEBAR } from '../constans';

const cognito = new CognitoAWS();

export function updateTheme(payload: any) {
  return {
    payload,
    type: THEME
  };
}

export function signIn(payload: any) {
  return {
    payload,
    type: SIGN_IN
  };
}

export function signOut() {
  return {
    type: SIGN_OUT
  };
}

export function updateCounts(payload: any) {
  return {
    payload,
    type: UPDATE_COUNT_SIDEBAR
  };
}

export function _refreshToken(payload: any) {
  return {
    type: REFRESH_TOkEN,
    payload
  };
}

export function loadingAuth(payload: any) {
  return {
    type: LOADING_AUTH,
    payload
  };
}

export function logOut() {
  return (dispatch: any) => {
    cognito
      .signOut()
      .then(() => {
        // clear signIn
        localStorage.clear();
        dispatch(loadingAuth({ authReady: false }));
        dispatch(signOut());
      })
      .catch(() => {
        showMessage('', 'Problemas al cerrar sesión', 'error');
      });
  };
}

export function forceLogOut() {
  console.warn('forceLogOut');

  return (dispatch: any) => {
    dispatch(loadingAuth({ authReady: true }));
    cognito
      .signOut()
      .then(() => {
        // clear signIn
        console.warn('cognito forceLogOut');

        localStorage.clear();
        dispatch(loadingAuth({ authReady: false }));
        dispatch(signOut());
      })
      .catch((error: any) => {
        console.error('cognito forceLogOut', error);

        localStorage.clear();
        dispatch(loadingAuth({ authReady: false }));
        dispatch(signOut());
      });
  };
}

export function verifyToken() {
  return (dispatch: any) => {
    cognito
      .validateActiveSession()
      .then((res: any) => {
        const {
          accessToken,
          idToken: {
            jwtToken,
            payload: { name, family_name }
          },
          refreshToken: { token }
        } = res;

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
      })
      .catch(() => {
        const values: any = {
          authReady: true,
          isLoggedIn: false,
          user: null
        };
        dispatch(signIn(values));
        dispatch(loadingAuth({ authReady: true }));
      });
  };
}

export function refreshToken() {
  return (dispatch: any) => {
    cognito
      .refreshToken()
      .then((res: any) => {
        const {
          accessToken,
          idToken: { jwtToken }
        } = res;
        localStorage.setItem('token', jwtToken);
        dispatch(_refreshToken(accessToken.jwtToken));
      })
      .catch((error: any) => {
        console.error('state', error);
        dispatch(loadingAuth({ authReady: false }));
        const values: any = {
          authReady: true,
          isLoggedIn: false,
          user: null
        };
        dispatch(signIn(values));
      });
  };
}
