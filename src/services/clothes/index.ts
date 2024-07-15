import { Clothe, FilterClothes } from '~models/clothes';
import apiClient from '../apiSuite';
import apiClientForm from '../apiSuiteForm';

const relativeRoute = '/ms_clothes/clothes';

/**
 * clothes pagination
 * @param organizationId
 * @param is_credential_issued
 * @param page
 * @param per_page
 * @param sort_by
 * @param order
 * @param search
 * @returns list of clothes
 */
function paginateClothes(
  organizationId: string,
  is_credential_issued: string,
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string,
  filters: FilterClothes
) {
  let query = '';
  for (const [key, value] of Object.entries(filters)) {
    query += `&${key}=${value}`;
  }
  if (is_credential_issued !== '') {
    query += `&is_credential_issued=${is_credential_issued}`;
  }
  return apiClient.get(
    `${relativeRoute}?organization_id=${organizationId}${query}&page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}
/**
 * clothes pagination
 * @param organizationId
 * @param is_credential_issued
 * @param page
 * @param per_page
 * @param sort_by
 * @param order
 * @param search
 * @returns list of clothes
 */
function paginateYarns(
  organizationId: string,
  is_credential_issued: string,
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string,
  filters: FilterClothes
) {
  let query = '';
  for (const [key, value] of Object.entries(filters)) {
    query += `&${key}=${value}`;
  }
  if (is_credential_issued !== '') {
    query += `&is_credential_issued=${is_credential_issued}`;
  }
  return apiClient.get(
    `/ms_clothes/yarns?organization_id=${organizationId}${query}&page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}
/**
 * clothes pagination
 * @param organizationId
 * @param is_credential_issued
 * @param page
 * @param per_page
 * @param sort_by
 * @param order
 * @param search
 * @returns list of clothes
 */
function paginatePanels(
  organizationId: string,
  is_credential_issued: string,
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string,
  filters: FilterClothes
) {
  let query = '';
  for (const [key, value] of Object.entries(filters)) {
    query += `&${key}=${value}`;
  }
  if (is_credential_issued !== '') {
    query += `&is_credential_issued=${is_credential_issued}`;
  }
  return apiClient.get(
    `/ms_clothes/fabric_inventories?organization_id=${organizationId}${query}&page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}

/**
 * * Create a Clothe
 */
function createClothe(data: Clothe) {
  return apiClient.post(`${relativeRoute}`, data);
}

/**
 * * Update a Clothe
 */
function updateClothe(id: string, data: Clothe) {
  return apiClient.patch(`${relativeRoute}/${id}`, data);
}

function getOneClothe(id: string, code: string) {
  let query = '';
  if (id) {
    query += `?id=${id}`;
  }
  if (code) {
    query += query === '' ? `?code=${code}` : `&code=${code}`;
  }
  return apiClient.get(`${relativeRoute}/find_one${query}`);
}

function updateImageClothe(data: FormData) {
  return apiClientForm.patch(`${relativeRoute}/update_image`, data);
}

function getYarn(id: string, organizationId: string) {
  return apiClient.get(`/ms_clothes/yarns/${id}?organization_id=${organizationId}`);
}
function getFabricInventory(id: string, organizationId: string) {
  return apiClient.get(`/ms_clothes/fabric_inventories/${id}?organization_id=${organizationId}`);
}

function getCredentialsByClothe(credential_schema_id: string) {
  return apiClient.get(`${relativeRoute}/issued_credentials?credential_schema_id=${credential_schema_id}`);
}
//organization
function getAttributesRelation(model_type: string, organization_id: string) {
  return apiClient.get(
    `${relativeRoute}/attributes_relation?entity_model_type=${model_type}&organization_id=${organization_id}`
  );
}

export {
  paginateClothes,
  paginatePanels,
  paginateYarns,
  createClothe,
  updateClothe,
  updateImageClothe,
  getOneClothe,
  getCredentialsByClothe,
  getAttributesRelation,
  getYarn,
  getFabricInventory
};
