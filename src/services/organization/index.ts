import apiClient from '../api';

/**
 * * Obtiene todas las organizaciones
 */

function getOrganizations() {
  return apiClient.get('/organizations/select');
}

export { getOrganizations };
