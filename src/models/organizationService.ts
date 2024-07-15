import { SystemTable, SystemTableDefault } from './systemTable';
import { OrganizationServiceInteraction } from './organizationServiceInteraction';

export type Organization = {
  id: string;
  name: string;
  description: string;
};

export type User = {
  first_name: string;
  last_name: string;
  phone: string;
  organization_id: string;
  organization_name: string;
};

export type OrganizationService = {
  id: string;
  user: User;
  organization_issuer_id: string;
  organization: Organization;
  organization_service_category: SystemTable;
  organization_service_type: SystemTable;
  organization_service_status_issuer: SystemTable;
  rate: string;
  organization_service_interactions: OrganizationServiceInteraction[];
  created_at: string;
  updated_at: string;
};

export type Files = {
  file: any;
  file_name: string;
  file_type: string;
};

export type OrganizationServiceCreate = {
  organization_service_category_id: string;
  organization_service_type_id: string;
  files: Files[];
  description: string;
};

// --- default ---

export const OrganizationDefault: Organization = {
  id: '-1',
  name: '',
  description: ''
};

export const UserDefault: User = {
  first_name: '',
  last_name: '',
  phone: '',
  organization_id: '',
  organization_name: ''
};

export const OrganizationServiceDefault: OrganizationService = {
  id: '-1',
  user: UserDefault,
  organization_issuer_id: '',
  organization: OrganizationDefault,
  organization_service_category: SystemTableDefault,
  organization_service_type: SystemTableDefault,
  organization_service_status_issuer: SystemTableDefault,
  rate: '',
  organization_service_interactions: [],
  created_at: '',
  updated_at: ''
};
