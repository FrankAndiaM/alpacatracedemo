import axios, { AxiosRequestConfig } from 'axios';
import { HOST_API_RENIEC, JWT_PREFIX } from '~config/environment';

const apiClient = axios.create({
  baseURL: `${HOST_API_RENIEC}`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
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
