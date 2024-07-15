import apiClient from '../api';

/**
 * * List OrganizationForms
 */
function paginateOrganizationsConnected(
  organization_id: string,
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string
) {
  return apiClient.get(`organizations/connections/${organization_id}?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}
  `);
}

export { paginateOrganizationsConnected };
