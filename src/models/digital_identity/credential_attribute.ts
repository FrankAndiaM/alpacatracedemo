export type CredentialAttributeModel = {
  id?: string;
  name?: string;
  description?: string;
  default_value?: string;
  attribute_type?: 'string' | 'number' | 'boolean' | 'enum' | 'date' | 'model' | null;
  possible_values: any[];
  is_required: boolean;
  position: number;
};
