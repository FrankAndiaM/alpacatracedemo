import { OrganizationFormAttributeEdit } from './organizationFormAttribute';

export type FilterClothes = {
  date_init?: string; //Optional[str] = Body(None),
  date_end?: string; //Optional[str] = Body(None),
  date_str?: string; //str = Body("all", enum=["all", "day_last", "week_last", "month_last"]),
  search?: string;
};

export const FilterFarmerDefault: FilterClothes = {
  date_init: '',
  date_end: '',
  date_str: '',
  search: ''
  // crop_id: []
};

export type AdditionalRow = {
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
export type AdditionalInfo = {
  id?: string;
  data?: AdditionalRow[];
  created_at?: string;
  updated_at?: string;
  disabled_at?: any;
  farmer_id?: string;
};

// export type Yarns = {
//   code: string;
//   additional_info?: AdditionalInfo[];
// };

export type CompositionClothe = {
  code: string;
  additional_info?: OrganizationFormAttributeEdit[];
  id?: string;
  model_description?: string;
  value?: string;
  image_path?: string;
  is_credential_issued?: boolean;
};

export type CompositionClotheYarns = CompositionClothe & {
  name: string;
  colors_code: string;
  composition: string;
  description: string;
  nm: string;
  presentation: string;
  title: string;
};
export type CompositionClotheFabricInventories = CompositionClothe & {
  // name: string;
  // colors_code: string;
  // composition: string;
  description: string;
  production_at: string;
  presentation: string;
  // title: string;
};

// type GatherFormImage = {
//   image: string;
//   gps: string;
// };

export type AttributesRelationship = {
  code: string;
  name: string;
  yarns: string;
  production_at: string;
  fabric_inventories: string;
  image_path: string;
  // image_path: GatherFormImage | string;
};
// };
export type AttributesRelation = {
  // export type AttributesRelation = {
  id: string;
  gather_form_id: string;
  gather_form_attribute_description_id: string;
  attributes_relationship: AttributesRelationship;
};

export const AttributesRelationDefault: AttributesRelation = {
  id: '',
  gather_form_id: '',
  gather_form_attribute_description_id: '',
  attributes_relationship: {
    code: '',
    name: '',
    yarns: '',
    production_at: '',
    fabric_inventories: '',
    image_path: ''
  }
};

export type Clothe = {
  id?: string;
  organization_id?: string;
  name?: string;
  code?: string;
  yarns?: CompositionClothe[];
  fabric_inventories?: CompositionClothe[];
  is_credential_issued?: boolean;
  image_path?: string;
  additional_info?: OrganizationFormAttributeEdit[];
  production_at?: string;
  created_at?: string;
  updated_at?: string;
  disabled_at?: string;
};

export type Yarn = {
  id?: string;
  code?: string;
  title?: string;
  description?: string;
  nm?: string;
  presentation?: string[];
  colors_code?: string;
  image_path?: string;
  composition?: string;
  additional_info?: any;
  created_at?: string;
  updated_at?: string;
};

export type FabricInventory = {
  id?: string;
  code?: string;
  title?: string;
  description?: string;
  nm?: string;
  presentation?: string[];
  colors_code?: string;
  image_path?: string;
  composition?: string;
  additional_info?: any;
  created_at?: string;
  updated_at?: string;
};

export const ClotheDefault = {
  id: '',
  organization_id: '',
  name: '',
  code: '',
  yarns: [],
  panels_clothes: [],
  is_credential_issued: false,
  production_at: '',
  created_at: '',
  updated_at: '',
  disabled_at: ''
};
