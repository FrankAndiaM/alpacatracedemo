import { FilterFarmer } from '~models/farmer';
import apiClient from '../api';
import apiSuite from '../apiSuite';
/**
 * * Obtiene todos los Farmers
 */
function paginateFarmers(
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string,
  filters: FilterFarmer
) {
  const router = `/farmers/paginate?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`;
  // let j: any;
  // for (j in tags) {
  //   router += `&tags=${tags[j]}`;
  // }
  return apiClient.post(router, filters);
}

/**
 * * Obtiene todos los Farmers
 */
function selectFarmer() {
  return apiClient.get('/farmers/select');
}

function selectFarmerByChannel(channel: string) {
  return apiClient.get(`/farmers/select_by_channel?channel=${channel}`);
}

/**
 * * Obtiene todos los Farmers
 */
function selectFarmerActives() {
  return apiClient.get('/farmers/select/actives');
}

function getFarmerByPhone(phone: string, channel: string) {
  return apiClient.get(`/producers/by_phone?phone=${phone}&channel=${channel}`);
}
/**
 * * Obtiene todos los productores con identidad digital creada
 */
function paginateProducerDigitalIdentity(
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string
) {
  return apiClient.get(
    `/producers/digital_identity_created?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}

// function getFarmerFilter(crops: string, zones: string) {
//   return apiClient.get(`/farmers/filter?crops=${crops}&zones=${zones}`);
// }
function getFarmerFilter(channel: string, tags: string[], farmers: string[]) {
  const obj = {
    channel,
    tag_ids: tags,
    farmer_ids: farmers
  };
  // let router = `/farmers/filters?channel=${channel}`;
  // let i: any, j: any;

  // for (i in farmers) {
  //   router += `&farmers=${farmers[i]}`;
  // }
  // for (j in tags) {
  //   router += `&tags=${tags[j]}`;
  // }

  return apiClient.post('/farmers/filters', obj);
}

/**
 * * Obtiene todos los Farmers
 */
function getFarmer(farmerId: string) {
  return apiClient.get(`/farmers/${farmerId}`);
}

function getVerifyColumnsFromFarmer(farmerId: string) {
  return apiClient.get(`/farmers/${farmerId}/verify_columns`);
}

function getFarmsFromFarmer(farmerId: string) {
  return apiClient.get(`/farmers/${farmerId}/farms`);
}

function getFormsFromFarmer(farmerId: string) {
  return apiClient.get(`/farmers/${farmerId}/forms`);
}

function getAdditionalDataFromFarmer(farmerId: string) {
  return apiClient.get(`/farmers/${farmerId}/additional_data`);
}

function createAdditionalDataFromFarmer(farmerId: string, data: any) {
  return apiClient.post(`/farmers/${farmerId}/additional_data`, data);
}

function loadFarmers(data: any) {
  return apiClient.post('/farmers/file', data);
}

function loadAdditionalDataFarmers(data: any) {
  return apiSuite.post('/massive_load_producers_profiles/load_producers_profiles', data);
}

function loadProductiveUnitsFarmers(data: any) {
  return apiSuite.post('/massive_load_productive_units/load_productive_units', data);
}

function DeleteFarmer(farmerId?: string) {
  return apiClient.delete(`/farmers/${farmerId}`);
}

function updateFarmer(farmerId?: string, data?: any) {
  return apiClient.put(`/farmers/${farmerId}`, data);
}

function createFarmer(data: any) {
  return apiClient.post('/farmers', data);
}

function listAllFarmersFilesLoaded() {
  return apiClient.get('/farmers/file/records');
}

function loadAllFarmersRecords(record_id: string) {
  return apiClient.get(`/farmers/file/records/${record_id}`);
}

function updateFarmerRecord(record_id: string, data: any) {
  return apiClient.put(`/farmers/file/records/${record_id}`, { ...data });
}

function updateFarmerLocation(farmerId: string, data: any) {
  return apiClient.put(`/farmers/${farmerId}/location`, data);
}

/**
 * * Obtiene el pre registro de los Farmers
 */
function paginatePreRegisterFarmers(page: number, per_page: number, sort_by: string, order: string, search: string) {
  return apiClient.get(
    `/pre_register_farmers?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}
/**
 * * Obtiene Farmers rechazados
 */
function paginateRejectFarmers(page: number, per_page: number, sort_by: string, order: string, search: string) {
  return apiClient.get(
    `/pre_register_farmers/rejects?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}
// rechaza la validación de un farmer
function rejectFarmerValidation(pre_register_farmer_id: string, data: any) {
  return apiClient.patch(`/pre_register_farmers/${pre_register_farmer_id}/reject`, data);
}

//actualiza el pre registro
function updatePreRegisterarmer(farmerId: string, data: any) {
  return apiClient.put(`/pre_register_farmers/${farmerId}`, data);
}

//acepta el pre registro
function approvePreRegisterFarmer(farmerId: string) {
  return apiClient.patch(`/pre_register_farmers/${farmerId}/approve`, {});
}

function updateProducerRecord(farmerId: string, data: any) {
  return apiClient.patch(`/farmers/${farmerId}/additional_info`, data);
}

function updateFarmerTags(farmerId: string, data: any) {
  return apiClient.patch(`/farmers/${farmerId}/tags`, data);
}

export {
  paginateFarmers,
  selectFarmer,
  getVerifyColumnsFromFarmer,
  loadFarmers,
  loadAdditionalDataFarmers,
  loadProductiveUnitsFarmers,
  createFarmer,
  getFarmer,
  listAllFarmersFilesLoaded,
  loadAllFarmersRecords,
  updateFarmerRecord,
  DeleteFarmer,
  getFarmerFilter,
  updateFarmer,
  getFarmsFromFarmer,
  getFormsFromFarmer,
  getAdditionalDataFromFarmer,
  createAdditionalDataFromFarmer,
  updateFarmerLocation,
  selectFarmerActives,
  selectFarmerByChannel,
  paginatePreRegisterFarmers,
  paginateRejectFarmers,
  rejectFarmerValidation,
  updatePreRegisterarmer,
  approvePreRegisterFarmer,
  updateProducerRecord,
  paginateProducerDigitalIdentity,
  updateFarmerTags,
  getFarmerByPhone
};
