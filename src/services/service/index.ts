import { ServiceInteractionCloseRequest } from '~models/organizationServiceInteraction';
import apiClient from '../apiSuiteForm';

/**
 * * List OrganizationService
 */
function listServices() {
  return apiClient.get('/organization_services/solicitudes');
}

/**
 * * List OrganizationService Types
 */
function listServiceTypes() {
  return apiClient.get('/organization_services/types');
}

/**
 * * List OrganizationService Categories
 */
function listServiceCategories() {
  return apiClient.get('/organization_services/categories');
}

/**
 * * Create a OrganizationService
 */
function createService(data: any) {
  return apiClient.post('/organization_services/solicitudes', data);
}

/**
 * * List OrganizationService Interactions by organizationServiceId
 */
function listServiceInteractionsByServiceId(serviceId: string) {
  return apiClient.get(`/organization_services/${serviceId}/interactions`);
}

/**
 * * Create OrganizationService Interactions by organizationServiceId
 */
function CreateServiceInteractionsByServiceId(serviceId: string, data: any) {
  return apiClient.post(`/organization_services/${serviceId}/interactions`, data);
}

/**
 * * Create OrganizationService Interactions by organizationServiceId
 */
function PutStatusServiceInteractionsByServiceId(serviceId: string, data: ServiceInteractionCloseRequest) {
  return apiClient.put(`/organization_services/${serviceId}/close`, data);
}

export {
  listServices,
  listServiceTypes,
  listServiceCategories,
  createService,
  listServiceInteractionsByServiceId,
  CreateServiceInteractionsByServiceId,
  PutStatusServiceInteractionsByServiceId
};
