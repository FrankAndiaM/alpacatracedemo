import apiClient from '../../apiSuite';

/**
 * * Obtiene todos los credential schemas
 */
function offerPredeterminedCredential(credential_schema_id: string, data: any) {
  return apiClient.post(`/credentials/agro_partners/credentials/${credential_schema_id}/predetermined/offer`, data);
}

export { offerPredeterminedCredential };
