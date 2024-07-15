import apiClient from '../api';

/**
 * * Obtiene todos los Crops
 */
function selectCrops() {
  return apiClient.get('/crops/select');
}

export { selectCrops };
