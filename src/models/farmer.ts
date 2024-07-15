import { Association, AssociationDefault } from './association';
import { Farm } from './farm';
import { SystemTable } from './systemTable';

export type FilterFarmer = {
  file_general?: string; //str = Body("all", enum=["all", "completed", "incompleted"]),
  file_unit_productive?: string; //str = Body("all", enum=["all", "completed", "incompleted"]),
  tag_id?: string[]; //Optional[List[str]] = Body([]),
  department_id_up?: string; //Optional[str] = Body(None),
  province_id_up?: string; //Optional[str] = Body(None),
  district_id_up?: string; //Optional[str] = Body(None),
  area_min_up?: number; //Optional[float] = Body(None),
  area_max_up?: number; //Optional[float] = Body(None),
  date_init?: string; //Optional[str] = Body(None),
  date_end?: string; //Optional[str] = Body(None),
  date_str?: string; //str = Body("all", enum=["all", "day_last", "week_last", "month_last"]),
  crop_id?: string; //Optional[str] = Body(None),
};

export const FilterFarmerDefault: FilterFarmer = {
  file_general: '',
  file_unit_productive: '',
  tag_id: [],
  department_id_up: '',
  province_id_up: '',
  district_id_up: '',
  area_min_up: 0,
  area_max_up: 0,
  date_init: '',
  date_end: '',
  date_str: ''
  // crop_id: []
};

export type CategoryTag = {
  id?: string;
  display_name: string;
  description: string;
  is_principal: boolean;
  color: string;
  created_at?: string;
  updated_at?: string;
  disabled_at?: string;
};

export type FarmPaginate = {
  id?: string;
  name: string;
  zone: SystemTable;
  created_at?: string;
  updated_at?: string;
  disabled_at?: string;
};

export type FarmById = {
  id?: string;
  name: string;
  zone: SystemTable;
  plantings: PlantingsPaginate[];
  created_at?: string;
  updated_at?: string;
  disabled_at?: string;
};

export type PlantingsPaginate = {
  id?: string;
  name: string;
  crop: SystemTable;
  created_at?: string;
  updated_at?: string;
  disabled_at?: string;
};

export type OrganizationById = {
  id?: string;
  short_name: string;
  district: SystemTable;
  created_at?: string;
  updated_at?: string;
  disabled_at?: string;
};

export type FarmerOrganizationById = {
  id?: string;
  is_with_card: boolean;
  organization: OrganizationById;
  created_at?: string;
  updated_at?: string;
  disabled_at?: string;
};

export type Tag = {
  id?: string;
  display_name: string;
  description: string;
  category: CategoryTag;
  created_at?: string;
  updated_at?: string;
  disabled_at?: string;
};

export type Farmer = {
  id?: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  dni: string;
  email: string;
  phone: string | null;
  phone_carrier?: string | null;
  phone_secondary?: string | null;
  phone_type?: string | null;
  certificacion_code: string;
  association_code: string;
  birthday_at: string;
  whatsapp_number: string | null;
  initial_farming_at: string;
  assigned_advisor_id?: string;
  association_id?: string;
  farms?: Farm[];
  association?: Association;
  percentage_status?: number;
  hamlet?: string | null;
  reference?: string | null;
  country_id?: string | null;
  department_id?: string | null;
  province_id?: string | null;
  district_id?: string | null;
  country?: any | null;
  department?: any | null;
  province?: any | null;
  district?: any | null;
  data_status?: string;
  created_at?: string;
  updated_at?: string;
  disabled_at?: string;
  additional_info?: AditionalInfo[];
  gender?: string;
  profile_photo_path?: string;
  is_biometric_verified?: boolean;
  tags: Tag[];
  commentary?: string;
  farmer_organizations?: FarmerOrganizationById[];
};

export type AditionalInfo = {
  id?: string;
  data?: AditionalRow[];
  created_at?: string;
  updated_at?: string;
  disabled_at?: any;
  farmer_id?: string;
};

export type AditionalRow = {
  id: string;
  name: string;
  value: any;
  position: number;
  description: string;
  is_required: boolean;
  display_name: string;
  attribute_type: string;
  possible_values: any[];
  category?: string;
};

export const FarmerDefault: Farmer = {
  id: '',
  first_name: '',
  last_name: '',
  full_name: '',
  dni: '',
  email: '',
  phone: '',
  phone_carrier: '',
  certificacion_code: '',
  association_code: '',
  birthday_at: '',
  whatsapp_number: '',
  initial_farming_at: '',
  assigned_advisor_id: '',
  association_id: '',
  farms: [],
  association: AssociationDefault,
  percentage_status: 0,
  tags: [],
  data_status: '',
  created_at: '',
  updated_at: '',
  disabled_at: ''
};
