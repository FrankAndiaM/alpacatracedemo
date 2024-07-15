import { Association, AssociationDefault } from './association';

export type Advisor = {
  id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  dni: string;
  phone: string;
  whatsapp_number: string;
  email?: string;
  birthday_at: string;
  association_id?: string;
  experience_start_date?: string;
  association?: Association;
  crops: any[];
  zones: any[];
  disabled_at?: string;
};

export const AdvisorDefault: Advisor = {
  id: '',
  first_name: '',
  last_name: '',
  full_name: '',
  dni: '',
  phone: '',
  whatsapp_number: '',
  email: '',
  association_id: '',
  birthday_at: '',
  crops: [],
  zones: [],
  experience_start_date: '',
  association: AssociationDefault
};
