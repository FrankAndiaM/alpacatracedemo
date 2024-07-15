export type OrganizationFormAttributeType =
  | 'title'
  | 'number'
  | 'formula'
  | 'conditional'
  | 'string'
  | 'date'
  | 'photo'
  | 'signature'
  | 'gps_point'
  | 'georeference'
  | 'list_options'
  | 'boolean'
  | 'audio'
  | 'multiple_selection'
  | 'altitude'
  | 'model';

export type OrganizationFormAttribute = {
  id?: string;
  name: string;
  display_name?: string;
  description?: string | null;
  category?: string | null;
  attribute_type: OrganizationFormAttributeType;
  possible_values: string[];
  schemas?: any[];
  formula?: string;
  is_required: boolean;
  is_public: boolean;
  is_delete?: boolean;
  is_edit?: boolean;
  created_at?: Date;
  updated_at?: Date;
  disabled_at?: Date;
};

export type ColumnAttributes = {
  description?: string;
  value: string;
  type: OrganizationFormAttributeType;
  name: string;
  display_name: string;
};

export type OrganizationFormAttributeEdit = OrganizationFormAttribute & {
  hiddenEdit?: boolean;
  position?: number;
  value?: any;
};

// ----------------------------------------------------------------------

export const ColumnAttributesDefault: ColumnAttributes = {
  description: '',
  value: '',
  type: 'string',
  name: '',
  display_name: ''
};
