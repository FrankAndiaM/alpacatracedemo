export type OrganizationFormAttributeType =
  | 'number'
  | 'string'
  | 'date'
  | 'photo'
  | 'file'
  | 'signature'
  | 'gps_point'
  | 'georeference'
  | 'list_options'
  | 'boolean';

export type ColumnAttributes = {
  description?: string;
  value: string;
  name: string;
  type: OrganizationFormAttributeType;
  display_name: string;
};

export type DataAdditionalProducer = {
  id: string;
  name: string;
  category: string;
  attributes: ColumnAttributes[];
  created_at: string;
};

// ----------------------------------------------------------------------

export const ColumnAttributesDefault: ColumnAttributes = {
  description: '',
  value: '',
  name: '',
  type: 'string',
  display_name: ''
};

export const DataAdditionalDefault: DataAdditionalProducer = {
  id: '-1',
  name: '',
  category: '',
  created_at: '10/20/20',
  attributes: []
};
