import apiClient from '../apiSuite';

/**
 * * Obtiene todos los Farmers
 */
function paginateRequests(
  status: string,
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string
) {
  return apiClient.get(
    `/web-visor/access-requests-digital-identity/organizations?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}&record_status=${status}`
  );
}
/**
 * * accept share organization
 */
function acceptRequestAccess(code: string) {
  return apiClient.patch(`/web-visor/access-requests-digital-identity/organizations/${code}/accept`, {});
}
/**
 * * reject share organization
 */
function rejectRequestAccess(code: string) {
  return apiClient.patch(`/web-visor/access-requests-digital-identity/organizations/${code}/reject`, {});
}

export { paginateRequests, acceptRequestAccess, rejectRequestAccess };
