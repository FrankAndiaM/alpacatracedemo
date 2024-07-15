import apiClient from '../api';
import apiSuite from '../apiSuite';

/**
 * * Obtiene Farmer cumulative
 */
function getFarmerCumulative() {
  return apiClient.get('/dashboard/producers');
}

/**
 * * Obtiene Form cumulative
 */
function getFormCumulative() {
  return apiClient.get('/dashboard/forms');
}

/**
 * * Obtiene las Farms de los productores registrados
 */
function getRegisteredFarms() {
  return apiClient.get('/dashboard/farms');
}

/**
 * * Obtiene el total de certificados emitidos
 */
function getNumberIssuedCredentials() {
  return apiClient.get('/dashboard/total_issued_credentials');
}
/**
 * * Obtiene el total de prendas
 */
function getTotalClothes(id: string) {
  return apiSuite.get(`ms_clothes/dashboard/clothes_count?organization_id=${id}`);
}

export { getFormCumulative, getFarmerCumulative, getRegisteredFarms, getNumberIssuedCredentials, getTotalClothes };
