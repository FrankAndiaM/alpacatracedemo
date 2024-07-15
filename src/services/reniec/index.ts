import apiClient from '../api_service_dni';

function getDNIData(dni: string) {
  return apiClient.get(`/${dni}`);
}

export { getDNIData };
