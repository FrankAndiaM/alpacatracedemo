import apiFormClient from '../apiform';

/**
 * * Create farm
 * @param data
 * @returns
 */
function createFarm(data: any) {
  return apiFormClient.post('/farms', data);
}

/**
 * * Delete farm media
 * @param data
 * @param farmId
 * @returns AxiosResponse
 */
function deleteFarm(farmId: string) {
  return apiFormClient.delete(`/farms/${farmId}`);
}

/**
 * * Create farm media
 * @param data
 * @param farmId
 * @returns AxiosResponse
 */
function createFarmMedia(data: any, farmId: string) {
  return apiFormClient.post(`/farms/${farmId}/medias`, data);
}

/**
 * * Delete farm media
 * @param data
 * @param farmId
 * @returns AxiosResponse
 */
function deleteFarmMedia(farmId: string, farmMediaId: string) {
  return apiFormClient.delete(`/farms/${farmId}/medias/${farmMediaId}`);
}

/**
 * * update farm media
 * @param data
 * @param farmId
 * @returns AxiosResponse
 */
function updateFarm(data: any, farmId: string) {
  return apiFormClient.put(`/farms/${farmId}`, data);
}

/**
 * * List farm media
 *
 * @param farmId
 * @returns AxiosResponse
 */
function listFarmMedia(farmId: string) {
  return apiFormClient.get(`/farms/${farmId}/media_types`);
}

/*
 */
function updateFarmAditionalRecord(farmId: string, data: any) {
  return apiFormClient.patch(`/farms/${farmId}/additional_info`, data);
}

// actualizar datos de la parcela
function updateFarmRecord(farmId: string, data: any) {
  return apiFormClient.put(`/farms/${farmId}`, data);
}

//actualiza el polígono de una unidad productiva
function updateFarmPolygon(productive_unit_id: string, data: any) {
  return apiFormClient.patch(`/farms/${productive_unit_id}`, data);
}

export {
  createFarm,
  updateFarm,
  deleteFarm,
  createFarmMedia,
  deleteFarmMedia,
  listFarmMedia,
  updateFarmAditionalRecord,
  updateFarmRecord,
  updateFarmPolygon
};
