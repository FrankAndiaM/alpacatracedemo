import apiClient from '../api';

/**
 * * Obtiene todos los departamentos
 */
function listAllDepartments() {
  return apiClient.get('/departments');
}

/**
 * * Obtiene todos las provincias de un departamento
 */
function listAllProvincesOfDepartment(departmentId: string) {
  return apiClient.get(`/departments/${departmentId}/provinces`);
}

/**
 * * Obtiene todos los distritos de una provincia
 */
function listAllDistrictsOfProvince(departmentId?: string, province?: string) {
  return apiClient.get(`/departments/${departmentId}/provinces/${province}/districts`);
}

export { listAllDepartments, listAllProvincesOfDepartment, listAllDistrictsOfProvince };
