import apiClient from '../../apiSuite';
import apiClientMain from '../../api';

/**
 * * Obtiene todos los credential schemas
 */
function listCredentialSchemas(schema_type: string) {
  return apiClient.get(`/credentials/agro_partners/credentials/definitions?${schema_type}`);
}

/**
 * * Obtiene un credential schema
 */
function getCredentialSchema(id: string) {
  return apiClient.get(`/credentials/agro_partners/credentials/definitions/${id}`);
}

/**
 * * Obtiene la lista de credenciales emitidas
 */
function listIssueCredentials(page: number, perPage: number, categories: any, status: any, issuance_at: any) {
  return apiClient.get(
    `/credentials/agro_partners/credentials/issued_credentials?page=${page}&per_page=${perPage}&categories=${categories}&status=${status}&issuance_at=${issuance_at}`
  );
}

/**
 * * Obtiene la lista de credenciales emitidas por id de credencial
 */
function listIssueCredentialsByCredentialId(id: string) {
  return apiClient.get(`/form_to_credential/credentials/${id}/issued`);
}

/**
 * * Lista los productores disponibles para emitir una credencial
 */
function listAvailableProducersToIssueCredential(id: string) {
  return apiClient.get(`/form_to_credential/credentials/${id}/producers`);
}

/**
 * * Emite una credencial a una lista de productores
 */
function issueCredential(id: string, data: any) {
  return apiClient.post(`/form_to_credential/credentials/${id}/issue`, data);
}

/**
 * * Crea un esquema de certificado a partir de un formulario
 */
function createCredentialSchema(data: any) {
  return apiClient.post('/credentials/agro_partners/credentials/definitions', data);
}

/**
 * * Crea un esquema de certificado a partir de un formulario
 */
function createCredentialSchemaFromForm(data: any) {
  return apiClient.post('/form_to_credential/credential_schema', data);
}

/**
 * * Lista todas las categorías de los esquemas de credenciales
 */
function listCredentialSchemaCategories() {
  return apiClient.get('/credentials/agro_partners/credentials/categories');
}

/**
 * * Obtiene un credential emitida
 */
function getIssuedCredential(id: string) {
  return apiClient.get(`/credentials/agro_partners/credentials/issued_credentials/${id}`);
}

/**
 * Obtiene la lista de credenciales por defecto emitidas
 */
function listDefaultIssuedCredentials(credentialSchemaId: string, model_type: 'all' | 'Organizations' | 'Farmers') {
  return apiClientMain.get(`/credentials/${credentialSchemaId}/issued?model_type=${model_type}`);
}

function offerCredential(id: string, data: any) {
  return apiClient.post(`/credentials/agro_partners/credentials/${id}/offer`, data);
}

export {
  listCredentialSchemas,
  getCredentialSchema,
  listIssueCredentialsByCredentialId,
  listAvailableProducersToIssueCredential,
  issueCredential,
  createCredentialSchemaFromForm,
  listCredentialSchemaCategories,
  getIssuedCredential,
  listIssueCredentials,
  listDefaultIssuedCredentials,
  offerCredential,
  createCredentialSchema
};
