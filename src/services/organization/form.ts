import { OrganizationForm } from '~models/organizationForm';
import apiClient from '../api';
import apiSuiteClient from '../apiSuite';

/**
 * * Create a OrganizationForm
 */
function createOrganizationForm(data: OrganizationForm) {
  return apiClient.post('/organizations/forms', data);
}

/**
 * * Update a OrganizationForm
 */
function updateOrganizationForm(id: string, data: OrganizationForm) {
  return apiClient.put(`/organizations/forms/${id}`, data);
}

/**
 * * Create a OrganizationForm
 */
function createOrganizationFormAttributes(data: OrganizationForm) {
  return apiClient.post(`/organizations/forms/${data.id}/attributes`, data);
}

/**
 * * List OrganizationForms
 */
function listOrganizationForm(type: boolean, entry_entity_type: string) {
  return apiClient.get(`/organizations/forms?is_archived=${type}&entry_entity_type=${entry_entity_type}`);
}

/**
 * * Select OrganizationForms
 */
function selectOrganizationForm() {
  return apiClient.get('/organizations/forms/select?entry_entity_type=Producers');
}

/**
 * * List disabled OrganizationForms
 */
function listDisabledOrganizationForm() {
  return apiClient.get('/organizations/forms/disabled');
}

/**
 * * Get a OrganizationForm
 */
function getOrganizationForm(id: string) {
  return apiClient.get(`/organizations/forms/${id}`);
}

/**
 * * Get OrganizationForm Data
 */
function paginateOrganizationFormBasicData(
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string,
  id: string
) {
  return apiClient.get(
    `/organizations/forms/${id}/basic_data?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}

function getOrganizationFormDataById(id_form: string, id_row: string) {
  return apiClient.get(`/organizations/forms/${id_form}/data/${id_row}`);
}

/**
 * * Get OrganizationForm Data
 */
function paginateOrganizationFormGeneralBasicData(
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string,
  id: string
) {
  return apiClient.get(
    `/organizations/forms/general/${id}/basic_data?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}

function getOrganizationFormGeneralDataById(id_form: string, id_row: string) {
  return apiClient.get(`/organizations/forms/general/${id_form}/data/${id_row}`);
}

/**
 * * Duplicate OrganizationForm
 */
function duplicateOrganizationForm(id: string) {
  return apiClient.post(`/organizations/forms/${id}/duplicate`, {});
}

/**
 * * Delete OrganizationForm
 */
function deleteOrganizationForm(id: string) {
  return apiClient.delete(`/organizations/forms/${id}`);
}

/**
 * * Archive OrganizationForm
 */
function archiveOrganizationForm(id: string) {
  return apiClient.patch(`/organizations/forms/${id}/archive`, {});
}

/**
 * * Unarchive OrganizationForm
 */
function unarchiveOrganizationForm(id: string) {
  return apiClient.patch(`/organizations/forms/${id}/unarchive`, {});
}

/**
 * * Restore OrganizationForm
 */
function restoreOrganizationForm(id: string) {
  return apiClient.put(`/organizations/forms/${id}/restore`, {});
}

/**
 * * get path to download OrganizationForm
 */
function downloadOrganizationFormData(id: string, data: any) {
  return apiSuiteClient.post(`/organization_form_data/${id}`, data);
}

// ficha del productor

function getAditionalSchemas() {
  return apiClient.get('/organizations/profile/additional_info_schemas');
}
function registerProducerRecord(data: any) {
  return apiClient.patch('/organizations/profile/additional_info/producer_profile', data);
}
function registerProductiveRecord(data: any) {
  return apiClient.patch('/organizations/profile/additional_info/productive_unit', data);
}

//selecion de mapas
function paginateOffLineZones(page: number, per_page: number, sort_by: string, order: string, search: string) {
  return apiClient.get(
    `/offline_zones?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}

function createOfflineZone(data: any) {
  return apiClient.post('/offline_zones', data);
}

function deleteOfflineZone(id: string) {
  return apiClient.delete(`/offline_zones/${id}`);
}

//update form
function updateFormData(organization_form_id: string, organization_form_data_id: string, data: any) {
  return apiClient.patch(`/organizations/forms/${organization_form_id}/data/${organization_form_data_id}`, data);
}

//update form
function updateOrganizationFormGeneral(organization_form_id: string, organization_form_data_id: string, data: any) {
  return apiClient.patch(
    `/organizations/forms/general/${organization_form_id}/data/${organization_form_data_id}`,
    data
  );
}

export {
  listOrganizationForm,
  createOrganizationFormAttributes,
  createOrganizationForm,
  updateOrganizationForm,
  getOrganizationForm,
  paginateOrganizationFormBasicData,
  getOrganizationFormDataById,
  deleteOrganizationForm,
  restoreOrganizationForm,
  listDisabledOrganizationForm,
  duplicateOrganizationForm,
  selectOrganizationForm,
  downloadOrganizationFormData,
  getAditionalSchemas,
  registerProducerRecord,
  registerProductiveRecord,
  paginateOffLineZones,
  createOfflineZone,
  deleteOfflineZone,
  archiveOrganizationForm,
  unarchiveOrganizationForm,
  updateFormData,
  paginateOrganizationFormGeneralBasicData,
  updateOrganizationFormGeneral,
  getOrganizationFormGeneralDataById
};
