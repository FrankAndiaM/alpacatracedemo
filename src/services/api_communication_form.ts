import axios, { AxiosRequestConfig } from 'axios';
import { API_URL_COMMUNICATION, JWT_PREFIX } from '~config/environment';
import store from '~redux-store/store';
import { forceLogOut, refreshToken } from '~redux-store/actions/authActions';
import { isExpired } from '../middlewares/jwt';

const apiClient = axios.create({
  baseURL: `${API_URL_COMMUNICATION}`,
  headers: {
    Accept: 'multipart/form-data',
    'Content-Type': 'multipart/form-data'
  }
});

// add Authorization
apiClient.interceptors.request.use(
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
apiClient.interceptors.response.use(
  (response: any) => {
    // refresh token
    if (isExpired()) store.dispatch(refreshToken());
    return response;
  },
  (error: any) => {
    const { response } = error;
    if (response?.status === 401 || response?.status === 412) {
      // token expired
      store.dispatch(forceLogOut());
      return; // Promise.reject(error);
    }

    if (response?.status === 403) {
      // Requiere autorizacion de headers
      store.dispatch(forceLogOut());
      return; // Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

//generar interceptors

export default {
  get(url: any) {
    return apiClient.get(url);
  },
  post(url: any, params: any) {
    return apiClient.post(url, params);
  },
  put(url: any, params: any) {
    return apiClient.put(url, params);
  },
  delete(url: any) {
    return apiClient.delete(url);
  }
};
