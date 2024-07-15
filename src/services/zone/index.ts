import apiClient from '../api';

/**
 * * Obtiene todos los Zones
 */
function selectZones() {
  return apiClient.get('/zones/select');
}

export { selectZones };
