export type ValueMedia = {
  name: string;
  type: string;
  path: string;
};

export type Organization = {
  id: string;
  name: string;
  short_name: string;
  logo_path: string;
};

export type Message = {
  type: string;
  value: any;
};

export type User = {
  first_name: string;
  last_name: string;
  phone: string;
  organization_id: string;
  organization_name: string;
};

export type OrganizationServiceInteraction = {
  id: string;
  user: User;
  organization: Organization;
  message: Message;
  type: string;
  created_at: string;
  updated_at: string;
};

export type ServiceInteractionRequest = {
  message: Message;
};

export type ServiceInteractionCloseRequest = {
  rate: number;
  message: string;
};

// --- default ---
export const OrganizationDefault: Organization = {
  id: '',
  name: '',
  short_name: '',
  logo_path: ''
};

export const ValueMediaDefault: ValueMedia = {
  name: '',
  type: '',
  path: ''
};

export const MessageDefault: Message = {
  type: '',
  value: ''
};
export const UserDefault: User = {
  first_name: '',
  last_name: '',
  phone: '',
  organization_id: '',
  organization_name: ''
};

export const OrganizationServiceInteractionDefault: OrganizationServiceInteraction = {
  id: '-1',
  user: UserDefault,
  organization: OrganizationDefault,
  message: MessageDefault,
  type: '',
  created_at: '',
  updated_at: ''
};
