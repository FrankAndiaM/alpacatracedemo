import apiClient from '../api';
import { PlantingsEdit, PlantingsCreate } from '~models/plantings';

/**
 * * Obtiene todos los Farmers
 */

function selectIrrigationFrecuency() {
  return apiClient.get('/plantings/irrigation_frecuency');
}

function updatePlanting(plantingId?: string, data?: PlantingsEdit) {
  return apiClient.put(`/plantings/${plantingId}`, data);
}

function createPlanting(data?: PlantingsCreate) {
  return apiClient.post('/plantings', data);
}

function deletePlanting(id: string) {
  return apiClient.delete(`plantings/${id}`);
}

export { selectIrrigationFrecuency, updatePlanting, createPlanting, deletePlanting };
