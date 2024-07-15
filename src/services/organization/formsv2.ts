import { FilterForms, OrganizationForm } from '~models/organizationForm';
import apiClient from '../apiSuite';
const relativeRoute = '/ms_gather_forms/gather_forms';
/**
 * * List Forms
 */
function listOrganizationForm(
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string,
  filters: FilterForms
) {
  let query = '';
  let i = 1;
  for (const [key, value] of Object.entries(filters)) {
    if (i === 1) {
      query += `?${key}=${value}`;
    } else {
      query += `&${key}=${value}`;
    }
    i++;
  }
  // console.log(query);
  return apiClient.get(
    `${relativeRoute}${query}&page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}

function getFormsFromFarmerv2(owner_model_id: string, entry_model_id: string) {
  // owner -> organización
  // entry -> person
  return apiClient.get(
    `${relativeRoute}/paginate_entities?owner_model_id=${owner_model_id}&entry_model_id=${entry_model_id}&entry_model_type=Producers&form_type=ALL&date_str=all&status=all&page=1&per_page=25&sort_by=name&order=desc`
  );
}

function listAllOrganizationForm(owner_model_id: string, entry_entity_type: string) {
  return apiClient.get(
    `${relativeRoute}/list_all?owner_model_id=${owner_model_id}&entry_entity_type=${entry_entity_type}`
  );
}

/**
 * * List Forms
 */
function listDownloadForms(filters: FilterForms) {
  let query = '';
  let i = 1;
  for (const [key, value] of Object.entries(filters)) {
    if (i === 1) {
      query += `?${key}=${value}`;
    } else {
      query += `&${key}=${value}`;
    }
    i++;
  }
  // console.log(query);
  return apiClient.get(`${relativeRoute}/list_download${query}`);
}

function paginateListFormsData(
  entry_entity_type: string,
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string,
  id: string
) {
  return apiClient.get(
    `${relativeRoute}/data/paginate?entry_entity_type=${entry_entity_type}&gather_form_id=${id}&page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search_data=${search}`
  );
}

function getFormDataById(id_form: string, id_row: string) {
  return apiClient.get(`${relativeRoute}/${id_form}/data/${id_row}`);
}

/**
 * * Get a Form
 */
function getOrganizationFormV2(id: string) {
  return apiClient.get(`${relativeRoute}/${id}`);
}

/**
 * * Duplicate Form
 */
function duplicateForm(id: string) {
  return apiClient.post(`${relativeRoute}/${id}/duplicate`, {});
}

/**
 * * Archive Form
 */
function archiveForm(id: string, is_archive: boolean) {
  return apiClient.patch(`${relativeRoute}/${id}/archive_or_unarchive?is_archive=${is_archive}`, {});
}

/**
 * * Create a Form
 */
function createForm(data: OrganizationForm) {
  return apiClient.post(`${relativeRoute}`, data);
}

/**
 * * Restore OrganizationForm
 */
function restoreForm(id: string) {
  return apiClient.patch(`${relativeRoute}/${id}/restore`, {});
}

/**
 * * Delete Form
 */
function deleteForm(id: string) {
  return apiClient.delete(`${relativeRoute}/${id}`);
}

/**
 * * Update a form
 */
function updateForm(id: string, data: OrganizationForm) {
  return apiClient.patch(`${relativeRoute}/${id}`, data);
}

/**
 * * update a Form schema
 */
function updateFormSchema(data: any) {
  return apiClient.patch(`${relativeRoute}/${data.id}/schema`, { schema: data.schema });
}

//update form data
function updateGatherFormData(gather_form_id: string, gather_form_data_id: string, data: any) {
  return apiClient.patch(`${relativeRoute}/${gather_form_id}/data/${gather_form_data_id}`, data);
}

/**
 * * get path to download OrganizationForm
 */
function downloadGatherFormData(id: string, data: any) {
  return apiClient.post(`/organization_form_data/${id}`, data);
}

function listAllFormData(
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string,
  filters: FilterForms
) {
  let query = '';
  let i = 1;
  for (const [key, value] of Object.entries(filters)) {
    if (i === 1) {
      query += `?${key}=${value}`;
    } else {
      query += `&${key}=${value}`;
    }
    i++;
  }
  // console.log(query);
  return apiClient.get(
    `${relativeRoute}/data/paginate${query}&page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search_data=${search}`
  );
}
function listAllDownloadData(filters: FilterForms) {
  let query = '';
  let i = 1;
  for (const [key, value] of Object.entries(filters)) {
    if (i === 1) {
      query += `?${key}=${value}`;
    } else {
      query += `&${key}=${value}`;
    }
    i++;
  }
  // console.log(query);
  return apiClient.get(`${relativeRoute}/data/list_all${query}`);
}

function countGatherFormsData(organizationId: string) {
  return apiClient.get(`/ms_gather_forms/dashboard/count_gather_forms_data?organization_id=${organizationId}`);
}

export {
  listOrganizationForm,
  paginateListFormsData,
  getFormDataById,
  getOrganizationFormV2,
  duplicateForm,
  archiveForm,
  createForm,
  deleteForm,
  updateForm,
  updateFormSchema,
  restoreForm,
  updateGatherFormData,
  downloadGatherFormData,
  listAllFormData,
  listAllDownloadData,
  listDownloadForms,
  listAllOrganizationForm,
  getFormsFromFarmerv2,
  countGatherFormsData
};
