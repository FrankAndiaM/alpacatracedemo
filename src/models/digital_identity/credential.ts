import { CredentialAttributeModel } from './credential_attribute';

export type CredentialSchemaModel = {
  id?: string;
  name: string;
  description?: string;
  version?: number;
  status?: 'pending' | 'registered' | null;
  is_unique?: boolean;
  is_support_revocation?: boolean;
  is_permanently?: boolean;
  credential_schema_type?: 'default' | 'predetermined' | 'form' | null;
  created_at?: Date;
  updated_at?: Date;
  credential_attributes?: CredentialAttributeModel[];
};
