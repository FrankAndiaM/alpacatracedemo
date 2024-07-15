import axios, { AxiosRequestConfig } from 'axios';
import { HOST_API_FORMS, JWT_PREFIX } from '~config/environment';
import store from '~redux-store/store';
import { forceLogOut, refreshToken } from '~redux-store/actions/authActions';
import { isExpired } from '../middlewares/jwt';

const apiClientForm = axios.create({
  baseURL: `${HOST_API_FORMS}`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    enctype: 'application/json'
  }
});

// add Authorization
apiClientForm.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = String(localStorage.getItem('token'));

    // eslint-disable-next-line
    //@ts-ignore
    config.headers.Authorization = JWT_PREFIX + ' ' + token;
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// interceptors
apiClientForm.interceptors.response.use(
  (response: any) => {
    // refresh token
    if (isExpired()) store.dispatch(refreshToken());
    return response;
  },
  (error: any) => {
    const { response } = error;
    if (response?.status === 401) {
      // token expired
      store.dispatch(forceLogOut());
      return; // Promise.reject(error);
    }

    if (response?.status === 403) {
      // Requiere autorización de headers
      store.dispatch(forceLogOut());
      return; // Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

//generar interceptors

export default {
  get(url: any) {
    return apiClientForm.get(url);
  },
  post(url: any, params: any) {
    return apiClientForm.post(url, params);
  },
  put(url: any, params: any) {
    return apiClientForm.put(url, params);
  },
  patch(url: any, params: any) {
    return apiClientForm.patch(url, params);
  },
  delete(url: any) {
    return apiClientForm.delete(url);
  }
};
